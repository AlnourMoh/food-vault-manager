
import { useToast } from '@/hooks/use-toast';
import { useScannerUI } from '../useScannerUI';

export const useMLKitScanner = () => {
  const { toast } = useToast();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();

  const startMLKitScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useMLKitScanner] بدء استخدام MLKit فوراً");
      
      // إعداد خلفية شفافة للكاميرا - مهم جدا لتفعيل الكاميرا بشكل صحيح
      await setupScannerBackground();
      
      // استيراد مكتبة MLKit
      const MLKitModule = await import('@capacitor-mlkit/barcode-scanning');
      const { BarcodeScanner } = MLKitModule;
      
      // تحقق من أذونات الكاميرا وطلبها إذا لزم الأمر
      const { camera } = await BarcodeScanner.checkPermissions();
      if (camera !== 'granted') {
        const result = await BarcodeScanner.requestPermissions();
        if (result.camera !== 'granted') {
          throw new Error("لم يتم منح إذن الكاميرا");
        }
      }
      
      // هذا الأمر ضروري لإظهار الكاميرا خلف عناصر التطبيق
      // يجب إضافته قبل بدء المسح لضمان ظهور الكاميرا
      await BarcodeScanner.enableTorch();  // Removed the incorrect boolean parameter
      
      // بدء المسح باستخدام واجهة البرمجة الجديدة
      // Remove the cameraDirection property which doesn't exist in ScanOptions
      const result = await BarcodeScanner.scan();
      
      // معالجة النتيجة إذا تم العثور على باركود
      if (result.barcodes && result.barcodes.length > 0) {
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
