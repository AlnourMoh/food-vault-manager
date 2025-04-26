
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
      
      // Request camera permissions immediately
      console.log("[useScannerDevice] طلب أذونات الكاميرا");
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

      // إعداد واجهة المسح فوراً
      console.log("[useScannerDevice] إعداد واجهة المسح");
      await setupScannerBackground();
      
      // Prepare the scanner
      console.log("[useScannerDevice] تجهيز الماسح الضوئي");
      await BarcodeScanner.prepare();
      
      // إعداد مستمع المسح
      console.log("[useScannerDevice] إعداد مستمع المسح");
      await setupScanListener(async (code) => {
        await stopDeviceScan();
        onSuccess(code);
      });

      // بدء المسح المستمر فوراً
      console.log("[useScannerDevice] بدء المسح المستمر مباشرة");
      const continuousScanStarted = await startContinuousScan();
      
      if (!continuousScanStarted) {
        console.log("[useScannerDevice] فشل بدء المسح المستمر، محاولة المسح البسيط");
        
        // محاولة المسح البسيط كخطة بديلة
        const simpleResult = await performSimpleScan();
        if (simpleResult) {
          console.log("[useScannerDevice] نجح المسح البسيط:", simpleResult);
          onSuccess(simpleResult);
          return true;
        }
        
        console.log("[useScannerDevice] فشل المسح البسيط أيضاً، استخدام المحاكاة");
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
          // Make sure to stop all scanning processes
          await BarcodeScanner.stopScan();
          await disableTorch();
          await BarcodeScanner.hideBackground();
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
