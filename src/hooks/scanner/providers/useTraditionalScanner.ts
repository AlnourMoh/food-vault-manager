
import { useToast } from '@/hooks/use-toast';
import { useScannerUI } from '../useScannerUI';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useTraditionalScanner = () => {
  const { toast } = useToast();
  const { setupScannerBackground, restoreUIAfterScanning } = useScannerUI();

  const startTraditionalScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useTraditionalScanner] استخدام MLKit كبديل للماسح التقليدي");
      
      // التأكد من أن BarcodeScanner متوفر
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log("[useTraditionalScanner] ماسح الباركود غير متاح");
        throw new Error("ماسح الباركود غير متاح");
      }
      
      // إعداد خلفية الماسح
      console.log("[useTraditionalScanner] إعداد خلفية الماسح");
      await setupScannerBackground();
      
      console.log("[useTraditionalScanner] بدء عملية المسح");
      await BarcodeScanner.prepare();
      
      const result = await BarcodeScanner.scan({
        formats: ["QR_CODE", "EAN_13", "CODE_128", "CODE_39", "UPC_A", "UPC_E"]
      });
      
      // تنظيف الموارد بعد المسح
      console.log("[useTraditionalScanner] انتهاء المسح، تنظيف الموارد");
      await restoreUIAfterScanning();
      
      if (result.barcodes && result.barcodes.length > 0) {
        console.log("[useTraditionalScanner] تم العثور على محتوى:", result.barcodes[0].rawValue);
        if (result.barcodes[0].rawValue) {
          onSuccess(result.barcodes[0].rawValue);
          return true;
        }
      }
      
      console.log("[useTraditionalScanner] لم يتم العثور على محتوى");
      throw new Error("لم يتم العثور على باركود");
    } catch (error) {
      console.error("[useTraditionalScanner] خطأ في عملية المسح:", error);
      
      // تنظيف الموارد في حالة الخطأ
      await restoreUIAfterScanning();
      
      // محاولة إيقاف المسح في حالة الخطأ
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        await BarcodeScanner.stopScan().catch(() => {});
      }
      
      throw error;
    }
  };

  const stopTraditionalScan = async () => {
    console.log("[useTraditionalScanner] إيقاف عملية المسح");
    try {
      // محاولة إيقاف المسح فقط إذا كانت الوحدة متاحة
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        await BarcodeScanner.enableTorch({ value: false }).catch(() => {});
        await BarcodeScanner.stopScan().catch(() => {});
      }
    } catch (error) {
      console.error('[useTraditionalScanner] خطأ في إيقاف المسح:', error);
    }
  };

  return { startTraditionalScan, stopTraditionalScan };
};
