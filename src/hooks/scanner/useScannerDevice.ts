
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { useToast } from '@/hooks/use-toast';

export const useScannerDevice = () => {
  const { toast } = useToast();
  
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useScannerDevice] بدء عملية المسح");
      
      // التحقق من دعم المنصة للماسح
      if (window.Capacitor) {
        console.log("[useScannerDevice] استخدام مكتبة ML Kit للمسح");
        
        // طلب الإذن والتحقق بشكل صريح
        const { camera } = await BarcodeScanner.requestPermissions();
        console.log("[useScannerDevice] حالة إذن الماسح:", camera);
        
        if (camera !== 'granted') {
          console.error("[useScannerDevice] تم رفض الإذن للماسح الضوئي");
          
          toast({
            title: "تم رفض الإذن",
            description: "لم يتم منح إذن الكاميرا. يرجى تمكين الإذن في إعدادات جهازك",
            variant: "destructive"
          });
          throw new Error("تم رفض الإذن للماسح الضوئي");
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
        
        // بدء عملية المسح
        console.log("[useScannerDevice] بدء عملية المسح ML Kit...");
        const { barcodes } = await BarcodeScanner.scan({
          formats: [
            BarcodeFormat.QrCode,
            BarcodeFormat.Ean13,
            BarcodeFormat.Ean8,
            BarcodeFormat.Code39,
            BarcodeFormat.Code128,
            BarcodeFormat.UpcA,
            BarcodeFormat.UpcE,
            BarcodeFormat.Pdf417,
            BarcodeFormat.Aztec,
            BarcodeFormat.DataMatrix
          ],
        });
        
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
      } else {
        // للتطوير/الويب: محاكاة المسح
        console.log("[useScannerDevice] في بيئة الويب، استخدام محاكاة للمسح");
        
        setTimeout(() => {
          const mockBarcode = `TEST-${Math.floor(Math.random() * 1000)}`;
          console.log("[useScannerDevice] باركود اختباري:", mockBarcode);
          onSuccess(mockBarcode);
        }, 2000);
      }
    } catch (error) {
      console.error("[useScannerDevice] خطأ في بدء عملية المسح:", error);
      
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
    } catch (error) {
      console.error("[useScannerDevice] خطأ في إيقاف عملية المسح:", error);
    }
  };
  
  return {
    startDeviceScan,
    stopDeviceScan
  };
};
