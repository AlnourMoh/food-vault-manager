
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useTorchControl } from './useTorchControl';
import { useScannerUI } from './useScannerUI';
import { useMockScanner } from './useMockScanner';
import { useDeviceDetection } from './device/useDeviceDetection';

export const useScannerDevice = () => {
  const { toast } = useToast();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();
  const { startMockScan } = useMockScanner();
  const { checkDeviceSupport } = useDeviceDetection();
  
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
      const permissionStatus = await BarcodeScanner.checkPermission({ force: true });
      
      if (!permissionStatus.granted) {
        console.log("[useScannerDevice] إذن الكاميرا غير ممنوح:", permissionStatus);
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

      // Show camera with transparency
      await BarcodeScanner.hideBackground();
      
      // بدء المسح
      console.log("[useScannerDevice] بدء عملية المسح الفعلية");
      const result = await BarcodeScanner.startScan({ targetedFormats: ['QR_CODE', 'EAN_13', 'CODE_128'] });
      
      // إغلاق المسح بعد النتيجة
      cleanupScannerBackground();
      
      // معالجة النتيجة
      if (result.hasContent) {
        console.log("[useScannerDevice] تم العثور على محتوى:", result.content);
        onSuccess(result.content);
        return true;
      } else {
        console.log("[useScannerDevice] لم يتم العثور على محتوى");
        toast({
          title: "لم يتم العثور على باركود",
          description: "حاول مرة أخرى مع توجيه الكاميرا بشكل أفضل",
          variant: "default"
        });
        return false;
      }
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
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        // Make sure to stop scanning
        await BarcodeScanner.stopScan();
        await BarcodeScanner.showBackground();
        cleanupScannerBackground();
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
