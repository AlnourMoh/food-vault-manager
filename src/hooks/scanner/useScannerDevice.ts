
import { useToast } from '@/hooks/use-toast';
import { useDeviceDetection } from './device/useDeviceDetection';
import { useMockScanner } from './useMockScanner';
import { useMLKitScanner } from './providers/useMLKitScanner';
import { useTraditionalScanner } from './providers/useTraditionalScanner';
import { barcodeScannerService } from '@/services/scanner/BarcodeScannerService';
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
      
      // عرض إشعار لوضع المسح
      try {
        await Toast.show({
          text: isNative ? 'جاري تهيئة الماسح الضوئي...' : 'المسح الضوئي غير متاح في هذه البيئة',
          duration: 'short'
        });
      } catch (toastError) {
        console.error("[useScannerDevice] خطأ في عرض الإشعار:", toastError);
      }
      
      // استخدام خدمة الماسح الضوئي الموحدة أولاً
      if (isNative && hasBarcodePlugin) {
        try {
          console.log("[useScannerDevice] محاولة استخدام خدمة الماسح الموحدة");
          
          // تسجيل معالج للمسح مع MLKit أولاً
          mlkitScanner.setOnScanCallback((code) => {
            console.log("[useScannerDevice] تم استلام رمز من MLKit:", code);
            onSuccess(code);
          });
          
          // محاولة استخدام MLKit للمسح
          console.log("[useScannerDevice] محاولة استخدام MLKit للمسح");
          const mlkitResult = await mlkitScanner.startScan();
          
          if (mlkitResult) {
            console.log("[useScannerDevice] نجح المسح باستخدام MLKit");
            return true;
          }
          
          console.warn("[useScannerDevice] فشل المسح باستخدام MLKit، جاري المحاولة بالماسح التقليدي");
        } catch (mlkitError) {
          console.warn("[useScannerDevice] خطأ في استخدام MLKit:", mlkitError);
        }
        
        // محاولة استخدام الماسح التقليدي كاحتياطي
        try {
          console.log("[useScannerDevice] محاولة استخدام الماسح التقليدي");
          return await startTraditionalScan(onSuccess);
        } catch (bsError) {
          console.error("[useScannerDevice] فشل المسح التقليدي:", bsError);
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
