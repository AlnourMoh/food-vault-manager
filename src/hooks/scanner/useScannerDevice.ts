
import { useToast } from '@/hooks/use-toast';
import { useDeviceDetection } from './device/useDeviceDetection';
import { useMockScanner } from './useMockScanner';
import { useMLKitScanner } from './providers/useMLKitScanner';
import { useTraditionalScanner } from './providers/useTraditionalScanner';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

export const useScannerDevice = () => {
  const { toast } = useToast();
  const { checkDeviceSupport } = useDeviceDetection();
  const { startMockScan } = useMockScanner();
  const mlkitScanner = useMLKitScanner();
  const { startTraditionalScan, stopTraditionalScan } = useTraditionalScanner();

  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح فوراً");
      
      // تحقق من المنصة
      const isNative = Capacitor.isNativePlatform();
      const hasBarcodePlugin = Capacitor.isPluginAvailable('BarcodeScanner') || 
                               Capacitor.isPluginAvailable('MLKitBarcodeScanner');
      
      console.log("[useScannerDevice] بيئة المسح:", {
        isNative,
        hasBarcodePlugin,
        platform: Capacitor.getPlatform()
      });
      
      // تهيئة الكاميرا أولاً قبل المسح إذا كنا في منصة أصلية
      if (isNative && hasBarcodePlugin) {
        try {
          // تهيئة كاميرا MLKit
          await mlkitScanner.initializeCamera();
          
          // تسجيل معالج للمسح
          mlkitScanner.setOnScanCallback((code) => {
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
