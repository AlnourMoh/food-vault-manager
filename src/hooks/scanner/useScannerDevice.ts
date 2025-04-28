
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
      
      if (!isCapacitor || !isSupported) {
        console.log("[useScannerDevice] استخدام وضع المحاكاة للمسح");
        startMockScan(onSuccess);
        return true;
      }
      
      try {
        return await startMLKitScan(onSuccess);
      } catch (mlkitError) {
        console.warn("[useScannerDevice] خطأ في استخدام MLKit:", mlkitError);
        
        try {
          return await startTraditionalScan(onSuccess);
        } catch (bsError) {
          console.error("[useScannerDevice] فشل المسح التقليدي:", bsError);
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
    await stopTraditionalScan();
  };

  return {
    startDeviceScan,
    stopDeviceScan
  };
};
