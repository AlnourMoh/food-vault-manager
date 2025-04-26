
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { useTorchControl } from './useTorchControl';
import { useScannerUI } from './useScannerUI';
import { useMockScanner } from './useMockScanner';
import { useDeviceDetection } from './device/useDeviceDetection';
import { useScanOperations } from './device/useScanOperations';
import { useScanListener } from './device/useScanListener';

export const useScannerDevice = () => {
  const { toast } = useToast();
  const { enableTorch, disableTorch } = useTorchControl();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();
  const { startMockScan } = useMockScanner();
  const { checkDeviceSupport } = useDeviceDetection();
  const { performSimpleScan, startContinuousScan } = useScanOperations();
  const { setupScanListener } = useScanListener();
  
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح");
      const { isSupported, isCapacitor } = await checkDeviceSupport();
      
      if (isCapacitor && isSupported) {
        const { camera } = await BarcodeScanner.requestPermissions();
        if (camera !== 'granted') {
          console.log("[useScannerDevice] إذن الكاميرا غير ممنوح:", camera);
          toast({
            title: "تم رفض الإذن",
            description: "يجب منح إذن الكاميرا لاستخدام الماسح الضوئي",
            variant: "destructive"
          });
          throw new Error("Camera permission not granted");
        }

        setupScannerBackground();
        await setupScanListener(async (code) => {
          await stopDeviceScan();
          onSuccess(code);
        });

        // محاولة المسح البسيط أولاً
        const simpleResult = await performSimpleScan();
        if (simpleResult) {
          onSuccess(simpleResult);
          return;
        }

        // إذا فشل المسح البسيط، نجرب المسح المستمر
        await startContinuousScan();
        return;
      }
      
      // استخدام المحاكاة إذا لم يكن الجهاز مدعومًا
      startMockScan(onSuccess);
      
    } catch (error) {
      console.error("[useScannerDevice] خطأ في بدء عملية المسح:", error);
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة بدء المسح، جاري تشغيل وضع المحاكاة",
        variant: "destructive"
      });
      startMockScan(onSuccess);
    }
  };
  
  const stopDeviceScan = async () => {
    try {
      console.log("[useScannerDevice] إيقاف عملية المسح");
      if (window.Capacitor) {
        const { supported } = await BarcodeScanner.isSupported();
        if (supported) {
          await BarcodeScanner.stopScan();
          await disableTorch();
          cleanupScannerBackground();
        }
      }
    } catch (error) {
      console.error("[useScannerDevice] خطأ في إيقاف المسح:", error);
    }
  };
  
  return {
    startDeviceScan,
    stopDeviceScan
  };
};
