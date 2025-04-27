
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
      
      // استخدام MLKit Barcode Scanner بدلاً من المكتبة الأخرى التي تسبب تعارضات
      try {
        const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
        
        // التحقق من الأذونات أولاً
        const status = await BarcodeScanner.checkPermissions();
        console.log("[useScannerDevice] حالة أذونات المسح:", status);
        
        if (status.camera !== 'granted') {
          const result = await BarcodeScanner.requestPermissions();
          console.log("[useScannerDevice] نتيجة طلب الأذونات:", result);
          
          if (result.camera !== 'granted') {
            toast({
              title: "إذن الكاميرا مطلوب",
              description: "يرجى السماح بالوصول إلى الكاميرا لاستخدام الماسح الضوئي",
              variant: "destructive"
            });
            return false;
          }
        }
        
        // إعداد واجهة المسح
        await setupScannerBackground();
        
        // بدء المسح
        const barcode = await BarcodeScanner.scan();
        console.log("[useScannerDevice] نتيجة المسح:", barcode);
        
        // تنظيف الواجهة بعد المسح
        cleanupScannerBackground();
        
        if (barcode && barcode.barcodes.length > 0) {
          // تم العثور على باركود صالح
          onSuccess(barcode.barcodes[0].rawValue);
          return true;
        } else {
          console.log("[useScannerDevice] لم يتم العثور على باركود");
          toast({
            title: "لم يتم العثور على باركود",
            description: "يرجى المحاولة مرة أخرى",
          });
          return false;
        }
      } catch (error) {
        console.error("[useScannerDevice] خطأ في MLKit:", error);
        
        // محاولة استخدام BarcodeScanner كحل احتياطي
        try {
          const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
          
          // التحقق من الأذونات
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

          // إعداد واجهة المسح
          await setupScannerBackground();
          await BarcodeScanner.hideBackground();
          
          // تجهيز الماسح
          await BarcodeScanner.prepare();
          
          // بدء المسح
          const result = await BarcodeScanner.startScan({ 
            targetedFormats: ['QR_CODE', 'EAN_13', 'CODE_128'] 
          });
          
          // تنظيف الواجهة
          cleanupScannerBackground();
          await BarcodeScanner.showBackground();
          
          // معالجة النتيجة
          if (result.hasContent) {
            onSuccess(result.content);
            return true;
          } else {
            toast({
              title: "لم يتم العثور على باركود",
              description: "حاول مرة أخرى",
              variant: "default"
            });
            return false;
          }
        } catch (fallbackError) {
          console.error("[useScannerDevice] فشل الحل الاحتياطي:", fallbackError);
          cleanupScannerBackground();
          
          // استخدام المحاكاة كملاذ أخير
          toast({
            title: "تعذر استخدام الكاميرا",
            description: "جاري تفعيل وضع الإدخال اليدوي",
            variant: "default"
          });
          
          startMockScan(onSuccess);
          return true;
        }
      }
    } catch (error) {
      console.error("[useScannerDevice] خطأ غير متوقع:", error);
      cleanupScannerBackground();
      
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة بدء المسح",
        variant: "destructive"
      });
      
      startMockScan(onSuccess);
      return true;
    }
  };
  
  const stopDeviceScan = async () => {
    try {
      console.log("[useScannerDevice] إيقاف المسح");
      
      // محاولة تنظيف MLKit أولاً
      if (window.Capacitor && window.Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
          console.log("[useScannerDevice] تنظيف MLKit BarcodeScanner");
          // لا حاجة لفعل شيء خاص هنا، MLKit يقوم بتنظيف الموارد تلقائياً
        } catch (e) {
          console.warn("[useScannerDevice] خطأ في تنظيف MLKit:", e);
        }
      }
      
      // محاولة تنظيف BarcodeScanner التقليدي
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        try {
          const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
          console.log("[useScannerDevice] تنظيف BarcodeScanner التقليدي");
          
          await BarcodeScanner.showBackground().catch(e => 
            console.warn("[useScannerDevice] خطأ في إظهار الخلفية:", e)
          );
          
          await BarcodeScanner.stopScan().catch(e => 
            console.warn("[useScannerDevice] خطأ في إيقاف المسح:", e)
          );
        } catch (e) {
          console.warn("[useScannerDevice] خطأ في تحميل BarcodeScanner للتنظيف:", e);
        }
      }
      
      // تنظيف واجهة المسح في جميع الحالات
      cleanupScannerBackground();
    } catch (error) {
      console.error("[useScannerDevice] خطأ في إيقاف المسح:", error);
      // محاولة تنظيف الواجهة على الأقل
      cleanupScannerBackground();
    }
  };
  
  return {
    startDeviceScan,
    stopDeviceScan
  };
};
