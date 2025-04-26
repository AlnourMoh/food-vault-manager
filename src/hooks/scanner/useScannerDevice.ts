
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
      
      if (!isCapacitor) {
        console.log("[useScannerDevice] بيئة غير مدعومة، استخدام المحاكاة");
        startMockScan(onSuccess);
        return true;
      }
      
      if (!isSupported) {
        console.log("[useScannerDevice] الجهاز غير مدعوم، استخدام المحاكاة");
        startMockScan(onSuccess);
        return true;
      }
      
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted') {
        console.log("[useScannerDevice] إذن الكاميرا غير ممنوح:", camera);
        toast({
          title: "تم رفض الإذن",
          description: "يجب منح إذن الكاميرا لاستخدام الماسح الضوئي",
          variant: "destructive"
        });
        return false;
      }

      // إعداد واجهة المسح
      console.log("[useScannerDevice] إعداد واجهة المسح");
      setupScannerBackground();
      
      // إعداد مستمع المسح
      console.log("[useScannerDevice] إعداد مستمع المسح");
      await setupScanListener(async (code) => {
        await stopDeviceScan();
        onSuccess(code);
      });

      // محاولة المسح البسيط أولاً
      console.log("[useScannerDevice] محاولة المسح البسيط");
      const simpleResult = await performSimpleScan();
      if (simpleResult) {
        console.log("[useScannerDevice] نجح المسح البسيط:", simpleResult);
        onSuccess(simpleResult);
        return true;
      }

      // إذا فشل المسح البسيط، نجرب المسح المستمر
      console.log("[useScannerDevice] محاولة المسح المستمر");
      const continuousScanStarted = await startContinuousScan();
      
      if (!continuousScanStarted) {
        console.log("[useScannerDevice] فشل بدء المسح المستمر، استخدام المحاكاة");
        cleanupScannerBackground();
        startMockScan(onSuccess);
      }
      
      return true;
    } catch (error) {
      console.error("[useScannerDevice] خطأ في بدء عملية المسح:", error);
      cleanupScannerBackground();
      
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة بدء المسح، جاري تشغيل وضع المحاكاة",
        variant: "default"
      });
      
      startMockScan(onSuccess);
      return true; // نعيد true لأننا انتقلنا إلى وضع المحاكاة
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
