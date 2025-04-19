
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useToast } from '@/hooks/use-toast';
import { App } from '@capacitor/app';

export const useScannerDevice = () => {
  const { toast } = useToast();
  
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح");
      
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        console.log("[useScannerDevice] استخدام ملحق BarcodeScanner من Capacitor");
        
        // الحصول على حالة الإذن الحالية وإظهار رسالة طلب الإذن
        const status = await BarcodeScanner.checkPermission({ force: true });
        console.log("[useScannerDevice] حالة إذن الباركود سكانر:", status);
        
        // إذا لم يتم منح الإذن، نحاول مرة أخرى بإظهار رسالة
        if (!status.granted) {
          console.log("[useScannerDevice] لم يتم منح الإذن، طلب إظهار مربع حوار الإذن");
          
          // محاولة صريحة لطلب الإذن مع force = true
          const retryStatus = await BarcodeScanner.checkPermission({ force: true });
          console.log("[useScannerDevice] نتيجة محاولة طلب الإذن مرة ثانية:", retryStatus);
          
          if (!retryStatus.granted) {
            console.error("[useScannerDevice] تم رفض الإذن للماسح الضوئي");
            toast({
              title: "تم رفض الإذن",
              description: "لم يتم منح إذن الكاميرا. يرجى تمكين الإذن في إعدادات جهازك لتطبيق مخزن الطعام.",
              variant: "destructive"
            });
            throw new Error("تم رفض الإذن للماسح الضوئي");
          }
        }
        
        // تجهيز الماسح
        await BarcodeScanner.prepare();
        console.log("[useScannerDevice] تم تجهيز الماسح الضوئي بنجاح");
        
        // التأكد من أن واجهة التطبيق معدة للعرض
        document.documentElement.style.backgroundColor = "transparent";
        document.body.style.backgroundColor = "transparent";
        document.body.style.visibility = 'hidden';
        document.body.classList.add('barcode-scanner-active');
        
        // إظهار منطقة الماسح
        await BarcodeScanner.hideBackground();
        console.log("[useScannerDevice] تم إخفاء الخلفية للماسح");
        
        // بدء المسح مع الإعدادات المحسنة
        console.log("[useScannerDevice] بدء المسح بإعدادات محسنة...");
        const result = await BarcodeScanner.startScan({
          targetedFormats: ['QR_CODE', 'EAN_13', 'EAN_8', 'CODE_39', 'CODE_128', 'UPC_A', 'UPC_E', 
                           'PDF_417', 'AZTEC', 'DATA_MATRIX', 'ITF', 'CODABAR'],
          cameraDirection: 'back'
        });
        
        console.log("[useScannerDevice] نتيجة المسح:", result);
        
        if (result.hasContent) {
          console.log("[useScannerDevice] تم مسح الباركود:", result.content);
          // إعادة إظهار واجهة التطبيق
          document.body.style.visibility = 'visible';
          document.body.classList.remove('barcode-scanner-active');
          document.documentElement.style.backgroundColor = "";
          document.body.style.backgroundColor = "";
          await BarcodeScanner.showBackground();
          onSuccess(result.content);
        } else {
          console.log("[useScannerDevice] انتهت عملية المسح لكن لم يتم العثور على محتوى");
          // إعادة إظهار واجهة التطبيق
          document.body.style.visibility = 'visible';
          document.body.classList.remove('barcode-scanner-active');
          document.documentElement.style.backgroundColor = "";
          document.body.style.backgroundColor = "";
          await BarcodeScanner.showBackground();
        }
      } else {
        console.log("[useScannerDevice] تشغيل في بيئة الويب أو عدم توفر الملحق - استخدام باركود اختباري");
        // للتطوير/الويب: محاكاة المسح
        toast({
          title: "نسخة الويب",
          description: "هذا محاكاة للماسح الضوئي في بيئة الويب",
        });
        
        setTimeout(() => {
          // للاختبار، إنشاء رمز عشوائي
          const mockBarcode = `TEST-${Math.floor(Math.random() * 1000)}`;
          console.log("[useScannerDevice] باركود اختباري:", mockBarcode);
          onSuccess(mockBarcode);
        }, 2000);
      }
    } catch (error) {
      console.error("[useScannerDevice] خطأ في بدء عملية المسح:", error);
      // التأكد من رؤية واجهة المستخدم في حالة الخطأ
      document.body.style.visibility = 'visible';
      document.body.classList.remove('barcode-scanner-active');
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        await BarcodeScanner.showBackground();
        await BarcodeScanner.stopScan();
      }
      throw error; // نشر الخطأ ليتم معالجته من قبل المستدعي
    }
  };
  
  const stopDeviceScan = async () => {
    try {
      console.log("[useScannerDevice] إيقاف عملية المسح");
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        // إيقاف الماسح
        await BarcodeScanner.stopScan();
        console.log("[useScannerDevice] تم إيقاف الماسح");
        
        // التأكد من رؤية واجهة التطبيق مرة أخرى
        document.body.style.visibility = 'visible';
        document.body.classList.remove('barcode-scanner-active');
        document.documentElement.style.backgroundColor = "";
        document.body.style.backgroundColor = "";
        
        // إخفاء طبقة الكاميرا
        await BarcodeScanner.showBackground();
        console.log("[useScannerDevice] تمت استعادة الخلفية");
      }
    } catch (error) {
      console.error("[useScannerDevice] خطأ في إيقاف عملية المسح:", error);
      // التأكد من رؤية واجهة المستخدم في حالة الخطأ
      document.body.style.visibility = 'visible';
      document.body.classList.remove('barcode-scanner-active');
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
    }
  };
  
  return {
    startDeviceScan,
    stopDeviceScan
  };
};
