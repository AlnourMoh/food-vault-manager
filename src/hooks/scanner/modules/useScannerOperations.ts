
import { useState, useCallback } from 'react';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

export const useScannerOperations = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Start scanning for barcodes
  const startScan = useCallback(async (onSuccess: (code: string) => void): Promise<boolean> => {
    try {
      // Check if we're on a native platform
      if (!Capacitor.isNativePlatform()) {
        console.log('نحن في بيئة الويب، الماسح غير متاح');
        setScanError('الماسح غير متاح في بيئة الويب');
        return false;
      }

      // Check if the plugin is available
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('ملحق MLKit غير متاح');
        setScanError('ملحق الماسح الضوئي غير متاح');
        return false;
      }

      console.log('بدء عملية المسح...');
      setScanError(null);
      setIsScanning(true);

      // Configure supported barcode formats
      const supportedFormats = [
        BarcodeFormat.QrCode,
        BarcodeFormat.Ean13,
        BarcodeFormat.Code128,
        BarcodeFormat.Code39,
        BarcodeFormat.UpcA,
        BarcodeFormat.UpcE
      ];

      // Prepare the scanner
      await BarcodeScanner.prepare();

      // Start scanning
      const result = await BarcodeScanner.scan({
        formats: supportedFormats
      });

      // Process result
      if (result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue;
        if (code) {
          setLastScannedCode(code);
          onSuccess(code);
          await stopScan();
          return true;
        }
      }

      // No barcode found
      setScanError('لم يتم العثور على باركود');
      await Toast.show({
        text: 'لم يتم العثور على باركود. يرجى المحاولة مرة أخرى.',
        duration: 'short'
      });

      await stopScan();
      return false;
    } catch (error) {
      console.error('خطأ في بدء المسح:', error);
      setScanError('حدث خطأ أثناء عملية المسح');
      await stopScan();
      return false;
    }
  }, []);

  // Stop the scanning process
  const stopScan = useCallback(async (): Promise<boolean> => {
    try {
      if (!isScanning) return true;

      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          // Attempt to disable torch if it was enabled
          await BarcodeScanner.disableTorch().catch(() => {});
          // Stop the scanning process
          await BarcodeScanner.stopScan().catch(() => {});
        } catch (error) {
          console.error('خطأ في إيقاف المسح:', error);
        }
      }

      setIsScanning(false);
      return true;
    } catch (error) {
      console.error('خطأ في إيقاف المسح:', error);
      setIsScanning(false);
      return false;
    }
  }, [isScanning]);

  return {
    isScanning,
    lastScannedCode,
    scanError,
    startScan,
    stopScan,
    setLastScannedCode
  };
};
