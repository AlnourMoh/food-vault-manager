
import { useToast } from '@/hooks/use-toast';
import { useScannerUI } from '../useScannerUI';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useMLKitScanner = () => {
  const { toast } = useToast();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();

  const startMLKitScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useMLKitScanner] بدء استخدام MLKit فوراً");
      
      // إعداد خلفية شفافة للكاميرا - مهم جدا لتفعيل الكاميرا بشكل صحيح
      await setupScannerBackground();
      
      // تحقق من أن MLKit مدعوم
      const supportResult = await BarcodeScanner.isSupported();
      console.log("[useMLKitScanner] هل الماسح مدعوم:", supportResult.supported);
      
      if (!supportResult.supported) {
        throw new Error("ماسح الباركود غير مدعوم على هذا الجهاز");
      }
      
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

      // تعزيز الشفافية للصفحة بأكملها
      document.documentElement.style.background = 'transparent';
      document.documentElement.style.backgroundColor = 'transparent';
      document.documentElement.style.setProperty('--background', 'transparent', 'important');
      document.body.style.background = 'transparent';
      document.body.style.backgroundColor = 'transparent';
      document.body.style.setProperty('--background', 'transparent', 'important');
      
      // إعداد واجهة المستخدم للشفافية - حيوي لتشغيل الكاميرا
      document.documentElement.classList.add('transparent-bg');
      document.body.classList.add('transparent-bg', 'scanner-active');

      try {
        // اختبار ما إذا كان الجهاز يدعم خاصية الفلاش
        const torchResult = await BarcodeScanner.isTorchAvailable();
        console.log("[useMLKitScanner] هل يدعم الفلاش:", torchResult.available);

        // محاولة تفعيل وإيقاف الفلاش لمساعدة تنشيط الكاميرا
        if (torchResult.available) {
          console.log("[useMLKitScanner] تفعيل الفلاش لتنشيط الكاميرا...");
          await BarcodeScanner.enableTorch();
          setTimeout(async () => {
            try {
              await BarcodeScanner.disableTorch();
            } catch (e) {}
          }, 300);
        }
      } catch (e) {
        console.log("[useMLKitScanner] خطأ في إعداد الفلاش، نتابع:", e);
      }
      
      console.log("[useMLKitScanner] بدء المسح...");
      
      // تأخير قصير قبل بدء المسح للسماح بتهيئة الكاميرا
      await new Promise(resolve => setTimeout(resolve, 100));
      
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
