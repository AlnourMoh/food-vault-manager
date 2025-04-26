
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export const useTorchControl = () => {
  const enableTorch = async () => {
    if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
      try {
        console.log('[useTorchControl] تشغيل الفلاش');
        // المكتبة الجديدة تستخدم toggleTorch مباشرة بدون فحص
        await BarcodeScanner.toggleTorch();
      } catch (error) {
        console.error('[useTorchControl] خطأ في تشغيل الفلاش:', error);
      }
    }
  };

  const disableTorch = async () => {
    if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
      try {
        console.log('[useTorchControl] إيقاف الفلاش');
        // نستخدم toggleTorch مرة أخرى لإيقاف الفلاش
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
