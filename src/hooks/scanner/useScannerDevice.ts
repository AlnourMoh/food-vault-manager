
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
        
        // إعادة التحقق من الأذونات بشكل صريح
        const status = await BarcodeScanner.checkPermission({ force: true });
        console.log("[useScannerDevice] حالة إذن الباركود سكانر:", status);
        
        if (!status.granted) {
          // محاولة طلب الإذن بشكل مباشر
          console.log("[useScannerDevice] لم يتم منح الإذن، محاولة طلب الإذن بشكل مباشر");
          // استخدام force: true لإجبار ظهور مربع حوار طلب الإذن
          const retryStatus = await BarcodeScanner.checkPermission({ force: true });
          
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
        console.log("[useScannerDevice] تجهيز الماسح الضوئي...");
        await BarcodeScanner.prepare();
        console.log("[useScannerDevice] تم تجهيز الماسح الضوئي بنجاح");
        
        // التأكد من أن واجهة التطبيق معدة للعرض
        document.documentElement.style.backgroundColor = "transparent";
        document.body.style.backgroundColor = "transparent";
        document.body.style.visibility = 'hidden';
        document.body.classList.add('barcode-scanner-active');
        
        // إخفاء الخلفية لإظهار الكاميرا
        await BarcodeScanner.hideBackground();
        console.log("[useScannerDevice] تم إخفاء الخلفية للماسح");
        
        // بدء المسح بإعدادات محسنة
        console.log("[useScannerDevice] بدء المسح...");
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
        console.log("[useScannerDevice] ملحق BarcodeScanner غير متوفر - استخدام محاكاة للماسح");
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
