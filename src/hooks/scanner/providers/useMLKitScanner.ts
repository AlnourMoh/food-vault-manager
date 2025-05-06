
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
        setIsScanning(false);
        toast({
          title: "غير مدعوم",
          description: "جهازك لا يدعم ماسح الباركود",
          variant: "destructive"
        });
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
          cleanupScannerBackground();
          setIsScanning(false);
          toast({
            title: "تم رفض الإذن",
            description: "يرجى تمكين إذن الكاميرا من إعدادات جهازك",
            variant: "destructive"
          });
          return false;
        }
      }
      
      // بدء المسح
      console.log("[useMLKitScanner] بدء عملية المسح...");
      const result = await BarcodeScanner.scan({
        formats: [
          BarcodeFormat.QrCode,
          BarcodeFormat.Ean13,
          BarcodeFormat.Code128
        ]
      });
      
      // تنظيف بعد المسح
      cleanupScannerBackground();
      setIsScanning(false);
      
      // معالجة النتيجة
      if (result.barcodes && result.barcodes.length > 0) {
        console.log("[useMLKitScanner] تم العثور على باركود:", result.barcodes[0].rawValue);
        onSuccess(result.barcodes[0].rawValue || '');
        return true;
      }
      
      console.log("[useMLKitScanner] لم يتم العثور على باركود");
      return false;
    } catch (error) {
      console.error("[useMLKitScanner] خطأ في عملية المسح:", error);
      cleanupScannerBackground();
      setIsScanning(false);
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة مسح الباركود",
        variant: "destructive"
      });
      return false;
    }
  };

  return { startMLKitScan, isScanning };
};
