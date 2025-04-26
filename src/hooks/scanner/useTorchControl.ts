
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export const useTorchControl = () => {
  const enableTorch = async () => {
    if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
      try {
        // Check if torch is available
        const torchAvailable = await BarcodeScanner.checkTorch();
        
        if (torchAvailable.available) {
          console.log('[useTorchControl] تشغيل الفلاش');
          await BarcodeScanner.toggleTorch();
        } else {
          console.log('[useTorchControl] الفلاش غير متوفر على هذا الجهاز');
        }
      } catch (error) {
        console.error('[useTorchControl] خطأ في تشغيل الفلاش:', error);
      }
    }
  };

  const disableTorch = async () => {
    if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
      try {
        // Check if torch is on first (not directly supported in this API, but we'll toggle anyway)
        console.log('[useTorchControl] إيقاف الفلاش');
        await BarcodeScanner.toggleTorch();
      } catch (error) {
        console.error('[useTorchControl] خطأ في إيقاف الفلاش:', error);
      }
    }
  };

  return {
    enableTorch,
    disableTorch
  };
};
