
import { useToast } from '@/hooks/use-toast';
import { useScannerUI } from '../useScannerUI';

export const useMLKitScanner = () => {
  const { toast } = useToast();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();

  const startMLKitScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useMLKitScanner] محاولة استخدام MLKit");
      const MLKitModule = await import('@capacitor-mlkit/barcode-scanning');
      const { BarcodeScanner, BarcodeFormat } = MLKitModule;
      
      const available = await BarcodeScanner.isSupported();
      if (!available) {
        console.log("[useMLKitScanner] MLKit غير مدعوم على هذا الجهاز");
        throw new Error("MLKit غير مدعوم");
      }
      
      const status = await BarcodeScanner.checkPermissions();
      if (status.camera !== 'granted') {
        const result = await BarcodeScanner.requestPermissions();
        if (result.camera !== 'granted') {
          throw new Error("تم رفض إذن الكاميرا");
        }
      }
      
      await setupScannerBackground();
      
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
      
      cleanupScannerBackground();
      
      if (barcode && barcode.barcodes.length > 0) {
        onSuccess(barcode.barcodes[0].rawValue);
        return true;
      }
      
      throw new Error("لم يتم العثور على باركود");
    } catch (error) {
      cleanupScannerBackground();
      throw error;
    }
  };

  return { startMLKitScan };
};
