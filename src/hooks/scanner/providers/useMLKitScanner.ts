
import { useToast } from '@/hooks/use-toast';
import { useScannerUI } from '../useScannerUI';

export const useMLKitScanner = () => {
  const { toast } = useToast();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();

  const startMLKitScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useMLKitScanner] بدء استخدام MLKit فوراً");
      
      // إعداد خلفية الماسح - مهم جدا لتفعيل الكاميرا بشكل صحيح
      await setupScannerBackground();
      
      // استيراد مكتبة MLKit
      const MLKitModule = await import('@capacitor-mlkit/barcode-scanning');
      const { BarcodeScanner, BarcodeFormat } = MLKitModule;
      
      // تحقق إذا كان هناك أذونات للكاميرا أولاً
      const { camera } = await BarcodeScanner.checkPermissions();
      
      // إذا لم يكن هناك إذن، اطلبه
      if (camera !== 'granted') {
        console.log("[useMLKitScanner] طلب أذونات الكاميرا");
        const result = await BarcodeScanner.requestPermissions();
        if (result.camera !== 'granted') {
          console.error("[useMLKitScanner] لم يتم منح إذن الكاميرا");
          throw new Error("لم يتم منح إذن الكاميرا");
        }
      }
      
      // تأكد من تثبيت وحدة Google Barcode Scanner
      const moduleResult = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
      if (!moduleResult.available) {
        console.log("[useMLKitScanner] تثبيت وحدة Google Barcode Scanner");
        await BarcodeScanner.installGoogleBarcodeScannerModule();
      }
      
      console.log("[useMLKitScanner] بدء المسح الفعلي");
      
      // تهيئة خيارات المسح
      const scanOptions = {
        formats: [
          BarcodeFormat.QrCode,
          BarcodeFormat.Code128,
          BarcodeFormat.Code39,
          BarcodeFormat.Ean13,
          BarcodeFormat.Ean8,
          BarcodeFormat.UpcA,
          BarcodeFormat.UpcE
        ]
      };
      
      // استخدام API scan بدلاً من startScan (حيث أن API قد تغير)
      const result = await BarcodeScanner.scan(scanOptions);
      
      // معالجة النتيجة
      if (result && result.barcodes && result.barcodes.length > 0) {
        console.log("[useMLKitScanner] تم العثور على باركود:", result.barcodes[0].rawValue);
        cleanupScannerBackground();
        onSuccess(result.barcodes[0].rawValue);
        return true;
      }
      
      console.log("[useMLKitScanner] لم يتم العثور على باركود");
      cleanupScannerBackground();
      return false;
      
    } catch (error) {
      console.error("[useMLKitScanner] خطأ في عملية المسح:", error);
      cleanupScannerBackground();
      throw error;
    }
  };

  return { startMLKitScan };
};
