
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
        // طلب الإذن بشكل صريح
        const result = await BarcodeScanner.requestPermissions();
        console.log("[useMLKitScanner] نتيجة طلب الأذونات:", result);
        
        if (result.camera !== 'granted') {
          throw new Error("لم يتم منح إذن الكاميرا");
        }
      }
      
      console.log("[useMLKitScanner] الأذونات متاحة، تهيئة الماسح...");

      // استخدم أسلوب تعديل الـ DOM مباشرة لتحسين الشفافية
      document.documentElement.style.background = 'transparent';
      document.documentElement.style.backgroundColor = 'transparent';
      document.body.style.background = 'transparent';
      document.body.style.backgroundColor = 'transparent';

      try {
        // تجربة تعيين عرض الكاميرا مباشرة قبل المسح
        const supportResult = await BarcodeScanner.isSupported();
        console.log("[useMLKitScanner] هل الماسح مدعوم:", supportResult.supported);

        // اختبار ما إذا كان الجهاز يدعم خاصية الفلاش
        const torchResult = await BarcodeScanner.isTorchAvailable();
        console.log("[useMLKitScanner] هل يدعم الفلاش:", torchResult.available);

        // محاولة تفعيل عرض الكاميرا قبل المسح
        console.log("[useMLKitScanner] محاولة تفعيل الفلاش للمساعدة في تهيئة الكاميرا...");
        await BarcodeScanner.enableTorch();
        console.log("[useMLKitScanner] تم تفعيل الفلاش بنجاح");
      } catch (e) {
        console.log("[useMLKitScanner] خطأ في تهيئة الماسح، نتابع المحاولة:", e);
      }
      
      console.log("[useMLKitScanner] بدء المسح...");
      
      // بدء المسح باستخدام واجهة البرمجة
      const result = await BarcodeScanner.scan({
        formats: undefined // مسح جميع أنواع الباركود
      });
      
      console.log("[useMLKitScanner] نتيجة المسح:", result);
      
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
