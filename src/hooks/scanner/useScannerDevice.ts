
import { useToast } from '@/hooks/use-toast';
import { useDeviceDetection } from './device/useDeviceDetection';
import { useMockScanner } from './useMockScanner';
import { useMLKitScanner } from './providers/useMLKitScanner';
import { useTraditionalScanner } from './providers/useTraditionalScanner';
import { barcodeScannerService } from '@/services/scanner/BarcodeScannerService';

export const useScannerDevice = () => {
  const { toast } = useToast();
  const { checkDeviceSupport } = useDeviceDetection();
  const { startMockScan } = useMockScanner();
  const { startMLKitScan } = useMLKitScanner();
  const { startTraditionalScan, stopTraditionalScan } = useTraditionalScanner();

  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح فوراً");
      
      // استخدام خدمة الماسح الضوئي الموحدة أولاً
      try {
        console.log("[useScannerDevice] محاولة استخدام خدمة الماسح الموحدة");
        const result = await barcodeScannerService.startScan(onSuccess);
        return result;
      } catch (serviceError) {
        console.warn("[useScannerDevice] خطأ في استخدام خدمة الماسح الموحدة:", serviceError);
        
        // محاولة استخدام MLKit كاحتياطي
        try {
          console.log("[useScannerDevice] محاولة استخدام MLKit للمسح");
          return await startMLKitScan(onSuccess);
        } catch (mlkitError) {
          console.warn("[useScannerDevice] خطأ في استخدام MLKit:", mlkitError);
          
          // محاولة استخدام الماسح التقليدي كاحتياطي ثانٍ
          try {
            console.log("[useScannerDevice] محاولة استخدام الماسح التقليدي");
            return await startTraditionalScan(onSuccess);
          } catch (bsError) {
            console.error("[useScannerDevice] فشل المسح التقليدي:", bsError);
            
            // في حالة فشل كل المحاولات، نستخدم وضع المحاكاة
            console.log("[useScannerDevice] استخدام وضع المحاكاة كحل نهائي");
            startMockScan(onSuccess);
            return true;
          }
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
      // محاولة إيقاف المسح باستخدام خدمة الماسح الموحدة
      await barcodeScannerService.stopScan();
      
      // محاولة إيقاف الماسح التقليدي كإجراء احتياطي
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
