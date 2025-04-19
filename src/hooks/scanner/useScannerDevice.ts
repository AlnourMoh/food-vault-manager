
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useToast } from '@/hooks/use-toast';
import { Camera } from '@capacitor/camera';

export const useScannerDevice = () => {
  const { toast } = useToast();
  
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح");
      
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        console.log("[useScannerDevice] استخدام ملحق BarcodeScanner من Capacitor");
        
        // إعادة التحقق من الأذونات بشكل صريح
        const permissionStatus = await BarcodeScanner.checkPermission({ force: true });
        console.log("[useScannerDevice] حالة إذن الباركود سكانر:", permissionStatus);
        
        if (!permissionStatus.granted) {
          console.error("[useScannerDevice] تم رفض الإذن للماسح الضوئي");
          
          // محاولة أخرى
          const retryStatus = await BarcodeScanner.checkPermission({ force: true });
          
          if (!retryStatus.granted) {
            console.error("[useScannerDevice] فشلت المحاولة الثانية في الحصول على الإذن");
            toast({
              title: "تم رفض الإذن",
              description: "لم يتم منح إذن الكاميرا. يرجى تمكين الإذن في إعدادات جهازك",
              variant: "destructive"
            });
            throw new Error("تم رفض الإذن للماسح الضوئي");
          }
        }
        
        // تجهيز الماسح
        console.log("[useScannerDevice] تجهيز الماسح الضوئي...");
        await BarcodeScanner.prepare();
        console.log("[useScannerDevice] تم تجهيز الماسح الضوئي بنجاح");
        
        // تعديل واجهة المستخدم للمسح
        document.body.style.visibility = 'hidden';
        document.body.classList.add('barcode-scanner-active');
        
        // إخفاء الخلفية لإظهار الكاميرا
        await BarcodeScanner.hideBackground();
        console.log("[useScannerDevice] تم إخفاء الخلفية للماسح");
        
        // بدء المسح بإعدادات محسنة
        console.log("[useScannerDevice] بدء المسح...");
        const result = await BarcodeScanner.startScan({
          targetedFormats: ['QR_CODE', 'EAN_13', 'EAN_8', 'CODE_39', 'CODE_128'],
          cameraDirection: 'back'
        });
        
        console.log("[useScannerDevice] نتيجة المسح:", result);
        
        // إعادة إظهار واجهة التطبيق
        document.body.style.visibility = 'visible';
        document.body.classList.remove('barcode-scanner-active');
        await BarcodeScanner.showBackground();
        
        if (result.hasContent) {
          console.log("[useScannerDevice] تم مسح الباركود:", result.content);
          onSuccess(result.content);
        } else {
          console.log("[useScannerDevice] انتهت عملية المسح لكن لم يتم العثور على محتوى");
          toast({
            title: "لم يتم العثور على باركود",
            description: "لم يتمكن الماسح من قراءة أي باركود",
            variant: "default" // Changed from "warning" to "default"
          });
        }
      } else if (window.Capacitor?.isPluginAvailable('Camera')) {
        // محاولة استخدام الكاميرا العادية إذا لم يكن الماسح متاحًا
        console.log("[useScannerDevice] BarcodeScanner غير متوفر، محاولة استخدام الكاميرا العادية");
        
        const cameraResult = await Camera.requestPermissions({
          permissions: ['camera']
        });
        
        if (cameraResult.camera === 'granted') {
          // محاكاة المسح في حالة عدم وجود ماسح حقيقي
          toast({
            title: "تنبيه",
            description: "ماسح الباركود غير متوفر، سيتم محاكاة عملية المسح",
            variant: "default" // Changed from "warning" to "default"
          });
          
          setTimeout(() => {
            const mockBarcode = `TEST-${Math.floor(Math.random() * 1000)}`;
            console.log("[useScannerDevice] باركود اختباري:", mockBarcode);
            onSuccess(mockBarcode);
          }, 2000);
        } else {
          toast({
            title: "تم رفض الإذن",
            description: "لم يتم منح إذن الكاميرا",
            variant: "destructive"
          });
        }
      } else {
        // للتطوير/الويب: محاكاة المسح
        console.log("[useScannerDevice] في بيئة الويب، استخدام محاكاة للمسح");
        toast({
          title: "بيئة الويب",
          description: "هذه محاكاة للماسح الضوئي في بيئة الويب",
          variant: "default" // Changed from "warning" to "default"
        });
        
        setTimeout(() => {
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
      
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        await BarcodeScanner.showBackground();
        await BarcodeScanner.stopScan();
      }
      
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة بدء المسح",
        variant: "destructive"
      });
      
      throw error;
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
        
        // إخفاء طبقة الكاميرا
        await BarcodeScanner.showBackground();
        console.log("[useScannerDevice] تمت استعادة الخلفية");
      }
    } catch (error) {
      console.error("[useScannerDevice] خطأ في إيقاف عملية المسح:", error);
      // التأكد من رؤية واجهة المستخدم في حالة الخطأ
      document.body.style.visibility = 'visible';
      document.body.classList.remove('barcode-scanner-active');
    }
  };
  
  return {
    startDeviceScan,
    stopDeviceScan
  };
};
