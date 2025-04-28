
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
      console.log("[useScannerDevice] بدء عملية المسح");
      const { isSupported, isCapacitor } = await checkDeviceSupport();
      
      // إذا لم تكن بيئة Capacitor أو الجهاز لا يدعم المسح، نستخدم المحاكاة
      if (!isCapacitor || !isSupported) {
        console.log("[useScannerDevice] استخدام وضع المحاكاة للمسح");
        startMockScan(onSuccess);
        return true;
      }
      
      // محاولة استخدام MLKit أولاً (الأفضل أداءً)
      try {
        console.log("[useScannerDevice] محاولة استخدام MLKit للمسح");
        return await startMLKitScan(onSuccess);
      } catch (mlkitError) {
        console.warn("[useScannerDevice] خطأ في استخدام MLKit:", mlkitError);
        
        // محاولة استخدام الماسح التقليدي كاحتياطي
        try {
          console.log("[useScannerDevice] محاولة استخدام الماسح التقليدي");
          return await startTraditionalScan(onSuccess);
        } catch (bsError) {
          console.error("[useScannerDevice] فشل المسح التقليدي:", bsError);
          
          // في حالة فشل كل المحاولات، نستخدم وضع المحاكاة كملاذ أخير
          console.log("[useScannerDevice] استخدام وضع المحاكاة كحل بديل");
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
