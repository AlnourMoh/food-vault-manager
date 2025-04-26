
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useToast } from '@/hooks/use-toast';
import { SupportedFormat } from '@/types/barcode-scanner';

export const useScanOperations = () => {
  const { toast } = useToast();

  const getScanOptions = () => ({
    targetedFormats: [
      SupportedFormat.QR_CODE,
      SupportedFormat.CODE_128,
      SupportedFormat.EAN_13,
      SupportedFormat.EAN_8,
      SupportedFormat.CODE_39
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
