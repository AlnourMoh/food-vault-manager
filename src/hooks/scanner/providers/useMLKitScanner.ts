
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
      
      // تحديث التهيئة لضمان عرض الكاميرا
      try {
        console.log("[useMLKitScanner] تفعيل وضع عرض الكاميرا قبل المسح");
        await BarcodeScanner.startScanning(
          {
            formats: [
              BarcodeFormat.QrCode,
              BarcodeFormat.Code128,
              BarcodeFormat.Code39,
              BarcodeFormat.Ean13,
              BarcodeFormat.Ean8,
              BarcodeFormat.UpcA,
              BarcodeFormat.UpcE
            ]
          },
          (result) => {
            console.log("[useMLKitScanner] تم العثور على باركود من المسح المستمر:", result.rawValue);
            BarcodeScanner.stopScanning();
            cleanupScannerBackground();
            onSuccess(result.rawValue);
          }
        );
        
        // انتظار مدة للعارض للتهيئة - يساعد في عرض الكاميرا
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (startError) {
        console.log("[useMLKitScanner] محاولة استخدام طريقة المسح العادية بعد فشل المسح المستمر:", startError);
        
        // المحاولة بالطريقة العادية للمسح
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
        cleanupScannerBackground();
        
        if (barcode && barcode.barcodes.length > 0) {
          console.log("[useMLKitScanner] تم العثور على باركود:", barcode.barcodes[0].rawValue);
          onSuccess(barcode.barcodes[0].rawValue);
          return true;
        }
      }
      
      console.log("[useMLKitScanner] انتهى المسح بدون نتائج");
      return false;
    } catch (error) {
      console.error("[useMLKitScanner] خطأ في عملية المسح:", error);
      cleanupScannerBackground();
      throw error;
    }
  };

  return { startMLKitScan };
};
