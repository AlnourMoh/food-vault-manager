
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useToast } from '@/hooks/use-toast';
import { BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';

export const useScanOperations = () => {
  const { toast } = useToast();

  // تبسيط الخيارات للحصول على أفضل أداء
  const getScanOptions = () => ({
    targetedFormats: [
      BarcodeFormat.QrCode,
      BarcodeFormat.Code128,
      BarcodeFormat.Ean13
    ],
    showTorchButton: true,
    showFlipCameraButton: false,
    prompt: "قم بتوجيه الكاميرا نحو الباركود"
  });

  // تبسيط وظيفة المسح لتقليل فرص حدوث أخطاء
  const performSimpleScan = async () => {
    try {
      console.log("[useScanOperations] بدء عملية المسح البسيطة");
      
      // محاولة المسح مباشرة
      const result = await BarcodeScanner.startScan(getScanOptions());
      
      if (result.hasContent) {
        console.log("[useScanOperations] تم العثور على محتوى:", result.content);
        return result.content;
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
