
import { useToast } from '@/hooks/use-toast';
import { useScannerUI } from '../useScannerUI';

export const useTraditionalScanner = () => {
  const { toast } = useToast();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();

  const startTraditionalScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("[useTraditionalScanner] استخدام BarcodeScanner التقليدي");
      const BSModule = await import('@capacitor-community/barcode-scanner');
      const { BarcodeScanner } = BSModule;
      
      const permissionStatus = await BarcodeScanner.checkPermission({ force: false });
      if (!permissionStatus.granted) {
        const newStatus = await BarcodeScanner.checkPermission({ force: true });
        if (!newStatus.granted) {
          throw new Error("تم رفض إذن الكاميرا");
        }
      }

      await setupScannerBackground();
      await BarcodeScanner.hideBackground();
      await BarcodeScanner.prepare();
      
      const result = await BarcodeScanner.startScan({ 
        targetedFormats: ['QR_CODE', 'EAN_13', 'CODE_128'] 
      });
      
      await BarcodeScanner.showBackground().catch(() => {});
      cleanupScannerBackground();
      
      if (result.hasContent) {
        onSuccess(result.content);
        return true;
      }
      
      throw new Error("لم يتم العثور على باركود");
    } catch (error) {
      cleanupScannerBackground();
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
        await BarcodeScanner.showBackground().catch(() => {});
        await BarcodeScanner.stopScan().catch(() => {});
      }
      throw error;
    }
  };

  const stopTraditionalScan = async () => {
    try {
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
        await BarcodeScanner.showBackground().catch(() => {});
        await BarcodeScanner.stopScan().catch(() => {});
      }
    } catch (error) {
      console.error('[useTraditionalScanner] خطأ في إيقاف المسح:', error);
    }
  };

  return { startTraditionalScan, stopTraditionalScan };
};
