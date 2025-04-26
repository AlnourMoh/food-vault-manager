
import { useToast } from '@/hooks/use-toast';
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
      
      // Dynamically import the BarcodeScanner to prevent issues during initialization
      const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
      
      // Request camera permissions immediately
      console.log("[useScannerDevice] طلب أذونات الكاميرا");
      try {
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
      } catch (permError) {
        console.error("[useScannerDevice] خطأ في طلب أذونات الكاميرا:", permError);
        startMockScan(onSuccess);
        return true;
      }

      // إعداد واجهة المسح فوراً
      console.log("[useScannerDevice] إعداد واجهة المسح");
      await setupScannerBackground();
      
      // Prepare the scanner
      console.log("[useScannerDevice] تجهيز الماسح الضوئي");
      try {
        await BarcodeScanner.prepare();
      } catch (prepareError) {
        console.error("[useScannerDevice] خطأ في تجهيز الماسح:", prepareError);
        cleanupScannerBackground();
        startMockScan(onSuccess);
        return true;
      }

      // Show camera with transparency
      try {
        await BarcodeScanner.hideBackground();
      } catch (bgError) {
        console.error("[useScannerDevice] خطأ في إخفاء الخلفية:", bgError);
      }
      
      // بدء المسح
      console.log("[useScannerDevice] بدء عملية المسح الفعلية");
      try {
        const result = await BarcodeScanner.startScan({ 
          targetedFormats: ['QR_CODE', 'EAN_13', 'CODE_128'] 
        });
        
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
      } catch (scanError) {
        console.error("[useScannerDevice] خطأ أثناء المسح:", scanError);
        cleanupScannerBackground();
        
        toast({
          title: "خطأ في المسح",
          description: "حدث خطأ أثناء محاولة المسح، جاري تشغيل وضع المحاكاة",
          variant: "default"
        });
        
        startMockScan(onSuccess);
        return true;
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
        const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
        
        // Make sure to stop scanning
        try {
          await BarcodeScanner.stopScan();
        } catch (stopError) {
          console.error("[useScannerDevice] خطأ في إيقاف المسح:", stopError);
        }
        
        try {
          await BarcodeScanner.showBackground();
        } catch (bgError) {
          console.error("[useScannerDevice] خطأ في إظهار الخلفية:", bgError);
        }
        
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
