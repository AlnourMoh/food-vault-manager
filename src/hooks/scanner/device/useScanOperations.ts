
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useToast } from '@/hooks/use-toast';
import { BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';

export const useScanOperations = () => {
  const { toast } = useToast();

  const getScanOptions = () => ({
    targetedFormats: [
      BarcodeFormat.QrCode,
      BarcodeFormat.Code128,
      BarcodeFormat.Ean13,
      BarcodeFormat.Ean8,
      BarcodeFormat.Code39
    ],
    showTorchButton: true,
    showFlipCameraButton: false,
    prompt: "قم بتوجيه الكاميرا نحو الباركود"
  });

  const performSimpleScan = async () => {
    try {
      console.log("[useScanOperations] استخدام طريقة المسح البسيطة");
      const result = await BarcodeScanner.startScan(getScanOptions());
      
      if (result.hasContent) {
        return result.content;
      }
      return null;
    } catch (error) {
      console.error("[useScanOperations] فشل المسح البسيط:", error);
      return null;
    }
  };

  return {
    performSimpleScan,
    getScanOptions
  };
};
