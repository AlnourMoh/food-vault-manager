
import { useToast } from '@/hooks/use-toast';
import { useScannerUI } from '../useScannerUI';

export const useMLKitScanner = () => {
  const { toast } = useToast();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();

  const startMLKitScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useMLKitScanner] بدء استخدام MLKit مباشرة");
      
      // التأكد من أن MLKit متوفر
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log("[useMLKitScanner] MLKit غير متاح على هذا الجهاز");
        throw new Error("MLKit غير متاح");
      }
      
      const MLKitModule = await import('@capacitor-mlkit/barcode-scanning');
      const { BarcodeScanner, BarcodeFormat } = MLKitModule;
      
      // طلب الإذن والتحقق من الدعم مباشرة
      console.log("[useMLKitScanner] طلب أذونات MLKit مباشرة");
      try {
        await BarcodeScanner.requestPermissions();
      } catch (permError) {
        console.log("[useMLKitScanner] خطأ في طلب الإذن:", permError);
        // نستمر حتى مع خطأ الإذن، قد يكون الإذن ممنوحاً بالفعل
      }
      
      // إعداد خلفية الماسح
      console.log("[useMLKitScanner] إعداد خلفية الماسح");
      await setupScannerBackground();
      
      console.log("[useMLKitScanner] بدء المسح فوراً");
      const barcode = await BarcodeScanner.scan({
        formats: [
          BarcodeFormat.QrCode,
          BarcodeFormat.Code128,
          BarcodeFormat.Code39,
          BarcodeFormat.Ean13,
          BarcodeFormat.Ean8,
          BarcodeFormat.UpcA,
          BarcodeFormat.UpcE
        ]
      });
      
      // تنظيف بعد المسح
      console.log("[useMLKitScanner] انتهاء المسح، تنظيف الخلفية");
      cleanupScannerBackground();
      
      if (barcode && barcode.barcodes.length > 0) {
        console.log("[useMLKitScanner] تم العثور على باركود:", barcode.barcodes[0].rawValue);
        onSuccess(barcode.barcodes[0].rawValue);
        return true;
      }
      
      console.log("[useMLKitScanner] لم يتم العثور على باركود");
      throw new Error("لم يتم العثور على باركود");
    } catch (error) {
      console.error("[useMLKitScanner] خطأ في عملية المسح:", error);
      cleanupScannerBackground();
      throw error;
    }
  };

  return { startMLKitScan };
};
