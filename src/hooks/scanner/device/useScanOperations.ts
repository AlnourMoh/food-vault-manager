
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { useToast } from '@/hooks/use-toast';
import { BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';

export const useScanOperations = () => {
  const { toast } = useToast();

  // تبسيط الخيارات للحصول على أفضل أداء
  const getScanOptions = () => ({
    formats: [
      BarcodeFormat.QrCode,
      BarcodeFormat.Code128,
      BarcodeFormat.Ean13
    ]
  });

  // تبسيط وظيفة المسح لتقليل فرص حدوث أخطاء
  const performSimpleScan = async () => {
    try {
      console.log("[useScanOperations] بدء عملية المسح البسيطة");
      
      // التحقق من الأذونات أولاً
      const permissionStatus = await BarcodeScanner.checkPermissions();
      if (permissionStatus.camera !== 'granted') {
        console.log("[useScanOperations] طلب إذن الكاميرا");
        const requestResult = await BarcodeScanner.requestPermissions();
        if (requestResult.camera !== 'granted') {
          console.error("[useScanOperations] تم رفض إذن الكاميرا");
          toast({
            title: "تم رفض الإذن",
            description: "يرجى تمكين إذن الكاميرا من إعدادات جهازك",
            variant: "destructive"
          });
          return null;
        }
      }
      
      // بدء المسح باستخدام MLKit
      console.log("[useScanOperations] بدء المسح باستخدام MLKit");
      const result = await BarcodeScanner.scan(getScanOptions());
      
      if (result.barcodes && result.barcodes.length > 0) {
        const barcode = result.barcodes[0];
        console.log("[useScanOperations] تم العثور على محتوى:", barcode.rawValue);
        return barcode.rawValue;
      }
      
      console.log("[useScanOperations] لم يتم العثور على محتوى");
      return null;
    } catch (error) {
      console.error("[useScanOperations] فشل المسح البسيط:", error);
      // إظهار رسالة للمستخدم عن الخطأ
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة مسح الباركود. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    performSimpleScan,
    getScanOptions
  };
};
