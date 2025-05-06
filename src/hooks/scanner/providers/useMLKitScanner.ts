
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useScannerUI } from '../useScannerUI';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';

export const useMLKitScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();

  const startMLKitScan = async (onSuccess: (code: string) => void) => {
    try {
      if (isScanning) {
        console.log("[useMLKitScanner] المسح نشط بالفعل، تجاهل الطلب");
        return true;
      }

      setIsScanning(true);
      console.log("[useMLKitScanner] بدء استخدام MLKit");
      
      // التحقق من دعم MLKit
      const supportResult = await BarcodeScanner.isSupported();
      console.log("[useMLKitScanner] هل الماسح مدعوم:", supportResult.supported);
      
      if (!supportResult.supported) {
        console.log("[useMLKitScanner] الماسح غير مدعوم، سنحاول طريقة أخرى");
        setIsScanning(false);
        return false;
      }
      
      // إعداد خلفية شفافة للكاميرا
      await setupScannerBackground();
      
      // تحقق من أذونات الكاميرا وطلبها إذا لزم الأمر
      const { camera } = await BarcodeScanner.checkPermissions();
      if (camera !== 'granted') {
        console.log("[useMLKitScanner] طلب إذن الكاميرا");
        const result = await BarcodeScanner.requestPermissions();
        
        if (result.camera !== 'granted') {
          console.log("[useMLKitScanner] تم رفض الإذن، إلغاء المسح");
          cleanupScannerBackground();
          setIsScanning(false);
          return false;
        }
      }
      
      // بدء المسح
      console.log("[useMLKitScanner] بدء عملية المسح...");
      try {
        const result = await BarcodeScanner.scan({
          formats: [
            BarcodeFormat.QrCode,
            BarcodeFormat.Ean13,
            BarcodeFormat.Code128,
            BarcodeFormat.Code39,
            BarcodeFormat.UpcA,
            BarcodeFormat.UpcE
          ]
        });
        
        // معالجة النتيجة
        if (result.barcodes && result.barcodes.length > 0) {
          console.log("[useMLKitScanner] تم العثور على باركود:", result.barcodes[0].rawValue);
          onSuccess(result.barcodes[0].rawValue || '');
          return true;
        } else {
          console.log("[useMLKitScanner] لم يتم العثور على باركود");
          return false;
        }
      } catch (scanError) {
        console.error("[useMLKitScanner] خطأ أثناء المسح:", scanError);
        // استخدام نمط وهمي في حالة الاختبار أو حدوث خطأ
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
          console.log("[useMLKitScanner] استخدام نمط الاختبار");
          setTimeout(() => {
            onSuccess(`TEST-${Math.floor(Math.random() * 1000000)}`);
          }, 1000);
          return true;
        }
        return false;
      } finally {
        // تنظيف بعد المسح
        cleanupScannerBackground();
        setIsScanning(false);
      }
    } catch (error) {
      console.error("[useMLKitScanner] خطأ في عملية المسح:", error);
      cleanupScannerBackground();
      setIsScanning(false);
      
      // استخدام نمط وهمي في حالة الاختبار أو حدوث خطأ
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        console.log("[useMLKitScanner] استخدام نمط الاختبار بعد الخطأ");
        setTimeout(() => {
          onSuccess(`TEST-${Math.floor(Math.random() * 1000000)}`);
        }, 1000);
        return true;
      }
      
      return false;
    }
  };

  return { startMLKitScan, isScanning };
};
