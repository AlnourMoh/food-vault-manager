
import { useToast } from '@/hooks/use-toast';
import { useDeviceDetection } from './device/useDeviceDetection';
import { useMockScanner } from './useMockScanner';
import { useMLKitScanner } from './providers/useMLKitScanner';
import { useTraditionalScanner } from './providers/useTraditionalScanner';

export const useScannerDevice = () => {
  const { toast } = useToast();
  const { checkDeviceSupport } = useDeviceDetection();
  const { startMockScan } = useMockScanner();
  const { startMLKitScan } = useMLKitScanner();
  const { startTraditionalScan, stopTraditionalScan } = useTraditionalScanner();

  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح مباشرة");
      const { isSupported, isCapacitor } = await checkDeviceSupport();
      
      // إذا كان الجهاز لا يدعم المسح، نستخدم المحاكاة فوراً
      if (!isCapacitor || !isSupported) {
        console.log("[useScannerDevice] استخدام وضع المحاكاة للمسح");
        startMockScan(onSuccess);
        return true;
      }
      
      // محاولة استخدام MLKit أولاً (الأفضل أداءً) - مباشرة دون تحققات إضافية
      try {
        console.log("[useScannerDevice] محاولة استخدام MLKit للمسح مباشرة");
        return await startMLKitScan(onSuccess);
      } catch (mlkitError) {
        console.warn("[useScannerDevice] خطأ في استخدام MLKit:", mlkitError);
        
        // محاولة استخدام الماسح التقليدي كاحتياطي - مباشرة
        try {
          console.log("[useScannerDevice] محاولة استخدام الماسح التقليدي مباشرة");
          return await startTraditionalScan(onSuccess);
        } catch (bsError) {
          console.error("[useScannerDevice] فشل المسح التقليدي:", bsError);
          
          // في حالة فشل كل المحاولات، نستخدم وضع المحاكاة
          console.log("[useScannerDevice] استخدام وضع المحاكاة كحل بديل نهائي");
          startMockScan(onSuccess);
          return true;
        }
      }
    } catch (error) {
      console.error("[useScannerDevice] خطأ غير متوقع في عملية المسح:", error);
      startMockScan(onSuccess);
      return true;
    }
  };

  const stopDeviceScan = async () => {
    console.log("[useScannerDevice] إيقاف المسح");
    try {
      await stopTraditionalScan();
    } catch (error) {
      console.error("[useScannerDevice] خطأ في إيقاف المسح:", error);
    }
  };

  return {
    startDeviceScan,
    stopDeviceScan
  };
};
