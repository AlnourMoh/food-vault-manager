
import { BarcodeScanner, BarcodeFormat, StartScanOptions } from '@capacitor-mlkit/barcode-scanning';
import { useToast } from '@/hooks/use-toast';

export const useScanOperations = () => {
  const { toast } = useToast();

  const getScanOptions = (): StartScanOptions => ({
    formats: [
      BarcodeFormat.QrCode,
      BarcodeFormat.Code128,
      BarcodeFormat.Ean13,
      BarcodeFormat.Ean8,
      BarcodeFormat.Code39
    ]
  });

  const performSimpleScan = async () => {
    try {
      console.log("[useScanOperations] استخدام طريقة المسح البسيطة");
      const result = await BarcodeScanner.scan();
      return result.barcodes[0]?.rawValue || null;
    } catch (error) {
      console.error("[useScanOperations] فشل المسح البسيط:", error);
      return null;
    }
  };

  const startContinuousScan = async () => {
    try {
      console.log("[useScanOperations] بدء المسح المستمر");
      await BarcodeScanner.startScan(getScanOptions());
      return true;
    } catch (error) {
      console.error("[useScanOperations] فشل بدء المسح المستمر:", error);
      return false;
    }
  };

  return {
    performSimpleScan,
    startContinuousScan
  };
};
