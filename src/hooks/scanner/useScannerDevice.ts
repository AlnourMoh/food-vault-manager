
import { useToast } from '@/hooks/use-toast';
import { useDeviceDetection } from './device/useDeviceDetection';
import { useMockScanner } from './useMockScanner';
import { useMLKitScanner } from './providers/useMLKitScanner';
import { useTraditionalScanner } from './providers/useTraditionalScanner';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { usePermissionRequest } from './permissions/usePermissionRequest';

export const useScannerDevice = () => {
  const { toast } = useToast();
  const { checkDeviceSupport } = useDeviceDetection();
  const { startMockScan } = useMockScanner();
  const mlkitScanner = useMLKitScanner();
  const { startTraditionalScan, stopTraditionalScan } = useTraditionalScanner();
  const { requestPermission } = usePermissionRequest();

  // دالة خاصة لفحص والحصول على أذونات الكاميرا قبل بدء المسح
  const ensureCameraPermission = async () => {
    try {
      console.log("[useScannerDevice] التحقق من إذن الكاميرا قبل البدء...");
      
      // طلب الإذن بشكل واضح ومباشر للمستخدم
      const permissionGranted = await requestPermission(true);
      
      // تسجيل نتيجة الطلب
      console.log(`[useScannerDevice] نتيجة طلب إذن الكاميرا: ${permissionGranted ? 'تم منح الإذن' : 'تم رفض الإذن'}`);
      
      // إظهار رسالة للمستخدم بناءً على النتيجة
      if (permissionGranted) {
        await Toast.show({
          text: 'تم منح إذن الكاميرا بنجاح! جاري بدء المسح...',
          duration: 'short'
        }).catch(() => {});
      } else {
        await Toast.show({
          text: 'تم رفض إذن الكاميرا، لن يعمل الماسح الضوئي',
          duration: 'long'
        }).catch(() => {});
      }
      
      return permissionGranted;
    } catch (error) {
      console.error("[useScannerDevice] خطأ أثناء طلب إذن الكاميرا:", error);
      return false;
    }
  };

  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح");
      
      // تحقق من المنصة
      const isNative = Capacitor.isNativePlatform();
      const hasBarcodePlugin = Capacitor.isPluginAvailable('BarcodeScanner') || 
                               Capacitor.isPluginAvailable('MLKitBarcodeScanner');
      
      console.log("[useScannerDevice] بيئة المسح:", {
        isNative,
        hasBarcodePlugin,
        platform: Capacitor.getPlatform()
      });
      
      // التحقق من أذونات الكاميرا أولاً
      if (isNative) {
        const hasPermission = await ensureCameraPermission();
        if (!hasPermission) {
          console.warn("[useScannerDevice] لم يتم منح إذن الكاميرا، التحويل إلى وضع المحاكاة");
          startMockScan(onSuccess);
          return false;
        }
      }
      
      // تهيئة الكاميرا إذا كنا في منصة أصلية
      if (isNative && hasBarcodePlugin) {
        try {
          // تهيئة كاميرا MLKit
          console.log("[useScannerDevice] محاولة تهيئة كاميرا MLKit");
          const initialized = await mlkitScanner.initializeCamera();
          
          if (!initialized) {
            console.warn("[useScannerDevice] فشل في تهيئة كاميرا MLKit");
            throw new Error("فشل في تهيئة الكاميرا");
          }
          
          console.log("[useScannerDevice] تم تهيئة الكاميرا بنجاح");
          
          // تسجيل معالج للمسح
          mlkitScanner.registerScanCallback((code) => {
            console.log("[useScannerDevice] تم استلام رمز من MLKit:", code);
            onSuccess(code);
          });
          
          // محاولة بدء المسح باستخدام MLKit
          console.log("[useScannerDevice] محاولة استخدام MLKit للمسح");
          const mlkitResult = await mlkitScanner.startScan();
          
          if (mlkitResult) {
            console.log("[useScannerDevice] نجح المسح باستخدام MLKit");
            return true;
          } else {
            console.warn("[useScannerDevice] لم ينجح المسح باستخدام MLKit، المحاولة بالماسح التقليدي");
          }
        } catch (mlkitError) {
          console.error("[useScannerDevice] خطأ في استخدام MLKit:", mlkitError);
          
          // عرض إشعار عن الخطأ
          try {
            await Toast.show({
              text: `حدث خطأ في MLKit: ${mlkitError.message || 'خطأ غير معروف'}`,
              duration: 'short'
            });
          } catch (e) {}
        }
        
        // محاولة استخدام الماسح التقليدي كاحتياطي
        try {
          console.log("[useScannerDevice] محاولة استخدام الماسح التقليدي");
          const traditionalResult = await startTraditionalScan(onSuccess);
          return traditionalResult;
        } catch (bsError) {
          console.error("[useScannerDevice] فشل المسح التقليدي:", bsError);
          
          // عرض إشعار عن الخطأ
          try {
            await Toast.show({
              text: `فشل المسح التقليدي: ${bsError.message || 'خطأ غير معروف'}`,
              duration: 'short'
            });
          } catch (e) {}
        }
      }
      
      // في حالة فشل كل المحاولات أو في بيئة غير أصلية، نستخدم وضع المحاكاة
      console.log("[useScannerDevice] استخدام وضع المحاكاة");
      toast({
        title: "تم التبديل إلى وضع المحاكاة",
        description: "لم نتمكن من الوصول إلى الماسح الضوئي للجهاز",
      });
      
      startMockScan(onSuccess);
      return true;
    } catch (error) {
      console.error("[useScannerDevice] خطأ غير متوقع في عملية المسح:", error);
      
      // إظهار رسالة خطأ للمستخدم
      toast({
        title: "حدث خطأ",
        description: "تعذر تهيئة الماسح الضوئي، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      
      // استخدام وضع المحاكاة كحل نهائي
      startMockScan(onSuccess);
      return false;
    }
  };

  const stopDeviceScan = async () => {
    console.log("[useScannerDevice] إيقاف المسح");
    try {
      // إيقاف ماسح MLKit
      await mlkitScanner.stopScan();
      
      // محاولة إيقاف الماسح التقليدي كإجراء احتياطي
      await stopTraditionalScan();
      
      return true;
    } catch (error) {
      console.error("[useScannerDevice] خطأ في إيقاف المسح:", error);
      return false;
    }
  };

  return {
    startDeviceScan,
    stopDeviceScan
  };
};
