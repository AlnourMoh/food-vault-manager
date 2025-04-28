
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
      
      // طلب الإذن مع تجاهل الأخطاء - نفترض أن الإذن ممنوح بالفعل
      try {
        console.log("[useMLKitScanner] محاولة طلب أذونات MLKit");
        await BarcodeScanner.requestPermissions();
        console.log("[useMLKitScanner] تم الحصول على الأذونات أو تجاهل الخطأ");
      } catch (permError) {
        console.log("[useMLKitScanner] تجاهل خطأ الإذن:", permError);
      }
      
      // تهيئة عرض الكاميرا
      try {
        console.log("[useMLKitScanner] إعداد عرض الكاميرا بشكل صحيح");
        await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()
          .then((result) => {
            if (!result.available) {
              console.log("[useMLKitScanner] تثبيت وحدة Google Barcode Scanner");
              return BarcodeScanner.installGoogleBarcodeScannerModule();
            }
            // Return a Promise<void> instead of an object
            return Promise.resolve();
          })
          .catch(error => {
            console.log("[useMLKitScanner] خطأ في التحقق من وحدة Barcode Scanner:", error);
          });
      } catch (moduleError) {
        console.log("[useMLKitScanner] تجاهل خطأ الوحدة:", moduleError);
      }
      
      console.log("[useMLKitScanner] بدء المسح فوراً");
      
      // محاولة المسح بأقصى وضوح وجودة - fix the ScanOptions properties
      const barcode = await BarcodeScanner.scan({
        formats: [
          BarcodeFormat.QrCode,
          BarcodeFormat.Code128,
          BarcodeFormat.Code39,
          BarcodeFormat.Ean13,
          BarcodeFormat.Ean8,
          BarcodeFormat.UpcA,
          BarcodeFormat.UpcE
        ],
        // Remove the unsupported 'lensFacing' property
        // lensFacing: 'back',
        detectionMode: 'continuous'
      });
      
      // تنظيف بعد المسح
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
