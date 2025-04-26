
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { useCallback } from 'react';

export const useScanListener = () => {
  const setupScanListener = useCallback(async (onCodeScanned: (code: string) => void) => {
    try {
      console.log("[useScanListener] إعداد مستمع المسح");
      
      const listenerPromise = BarcodeScanner.addListener(
        'barcodesScanned',
        async (result) => {
          console.log("[useScanListener] تم اكتشاف باركود:", result);
          
          if (result.barcodes && result.barcodes.length > 0) {
            const code = result.barcodes[0].rawValue || '';
            console.log("[useScanListener] المسح ناجح:", code);
            onCodeScanned(code);
            
            try {
              const listenerHandle = await listenerPromise;
              await listenerHandle.remove();
            } catch (removeError) {
              console.error("[useScanListener] خطأ في إزالة المستمع:", removeError);
            }
          }
        }
      );
      
      return listenerPromise;
    } catch (error) {
      console.error("[useScanListener] خطأ في إعداد مستمع المسح:", error);
      return null;
    }
  }, []);

  return { setupScanListener };
};
