
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { useToast } from '@/hooks/use-toast';
import { Camera } from '@capacitor/camera';

export const useScannerDevice = () => {
  const { toast } = useToast();
  
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح");
      
      // التحقق من دعم المنصة للماسح الجديد
      if (window.Capacitor) {
        console.log("[useScannerDevice] استخدام مكتبة ML Kit للمسح");
        
        // طلب الإذن والتحقق بشكل صريح
        const { granted } = await BarcodeScanner.requestPermissions();
        console.log("[useScannerDevice] حالة إذن الماسح ML Kit:", granted);
        
        if (!granted) {
          console.error("[useScannerDevice] تم رفض الإذن للماسح الضوئي");
          
          // محاولة أخرى
          const retryPermission = await BarcodeScanner.requestPermissions();
          
          if (!retryPermission.granted) {
            console.error("[useScannerDevice] فشلت المحاولة الثانية في الحصول على الإذن");
            toast({
              title: "تم رفض الإذن",
              description: "لم يتم منح إذن الكاميرا. يرجى تمكين الإذن في إعدادات جهازك",
              variant: "destructive"
            });
            throw new Error("تم رفض الإذن للماسح الضوئي");
          }
        }
        
        // التحقق من دعم الماسح
        const isSupported = await BarcodeScanner.isSupported();
        
        if (!isSupported) {
          console.warn("[useScannerDevice] ماسح ML Kit غير مدعوم على هذا الجهاز، استخدام محاكاة");
          toast({
            title: "غير مدعوم",
            description: "الماسح الضوئي غير مدعوم على هذا الجهاز، سيتم استخدام محاكاة",
            variant: "default"
          });
          
          // محاكاة المسح في حالة عدم الدعم
          setTimeout(() => {
            const mockBarcode = `TEST-${Math.floor(Math.random() * 1000)}`;
            console.log("[useScannerDevice] باركود محاكاة:", mockBarcode);
            onSuccess(mockBarcode);
          }, 2000);
          
          return;
        }
        
        // إعداد واجهة المستخدم للمسح
        console.log("[useScannerDevice] تجهيز الماسح...");
        document.body.classList.add('barcode-scanner-active');
        
        // بدء المسح باستخدام المكتبة الجديدة
        console.log("[useScannerDevice] بدء عملية المسح ML Kit...");
        const { barcodes } = await BarcodeScanner.scan({
          formats: ['QR_CODE', 'EAN_13', 'EAN_8', 'CODE_39', 'CODE_128', 'UPC_A', 'UPC_E', 'PDF_417', 'AZTEC', 'DATA_MATRIX'],
        });
        
        // إعادة إظهار واجهة التطبيق
        document.body.classList.remove('barcode-scanner-active');
        
        if (barcodes && barcodes.length > 0) {
          console.log("[useScannerDevice] تم مسح الباركود:", barcodes[0].rawValue);
          onSuccess(barcodes[0].rawValue || '');
        } else {
          console.log("[useScannerDevice] انتهت عملية المسح لكن لم يتم العثور على محتوى");
          toast({
            title: "لم يتم العثور على باركود",
            description: "لم يتمكن الماسح من قراءة أي باركود",
            variant: "default"
          });
        }
      } else if (window.Capacitor?.isPluginAvailable('Camera')) {
        // محاولة استخدام الكاميرا العادية إذا لم يكن الماسح متاحًا
        console.log("[useScannerDevice] ML Kit غير متوفر، محاولة استخدام الكاميرا العادية");
        
        const cameraResult = await Camera.requestPermissions({
          permissions: ['camera']
        });
        
        if (cameraResult.camera === 'granted') {
          // محاكاة المسح في حالة عدم وجود ماسح حقيقي
          toast({
            title: "تنبيه",
            description: "ماسح الباركود غير متوفر، سيتم محاكاة عملية المسح",
            variant: "default"
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
          variant: "default"
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
      document.body.classList.remove('barcode-scanner-active');
      
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
      document.body.classList.remove('barcode-scanner-active');
    } catch (error) {
      console.error("[useScannerDevice] خطأ في إيقاف عملية المسح:", error);
      document.body.classList.remove('barcode-scanner-active');
    }
  };
  
  return {
    startDeviceScan,
    stopDeviceScan
  };
};
