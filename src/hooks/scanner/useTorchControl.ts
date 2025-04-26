
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useTorchControl = () => {
  const enableTorch = async () => {
    try {
      if (window.Capacitor) {
        await BarcodeScanner.enableTorch();
      }
    } catch (error) {
      console.error('[useTorchControl] خطأ في تشغيل الإضاءة:', error);
    }
  };

  const disableTorch = async () => {
    try {
      if (window.Capacitor) {
        await BarcodeScanner.disableTorch();
      }
    } catch (error) {
      console.error('[useTorchControl] خطأ في إيقاف الإضاءة:', error);
    }
  };

  return {
    enableTorch,
    disableTorch
  };
};
