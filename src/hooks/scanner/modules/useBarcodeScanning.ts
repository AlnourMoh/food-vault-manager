
import { useState, useEffect, useCallback } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

interface UseBarcodeScanningProps {
  onScan: (code: string) => void;
  isScanningActive: boolean;
  setIsScanningActive: (active: boolean) => void;
  cameraActive: boolean;
  hasScannerError: boolean;
  setHasScannerError: (error: boolean | string | null) => void;
}

export const useBarcodeScanning = ({
  onScan,
  isScanningActive,
  setIsScanningActive,
  cameraActive,
  hasScannerError,
  setHasScannerError
}: UseBarcodeScanningProps) => {
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (isScanningActive && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        BarcodeScanner.stopScan().catch(console.error);
      }
    };
  }, [isScanningActive]);
  
  // بدء المسح
  const startScan = useCallback(async (): Promise<boolean> => {
    if (!cameraActive || isScanningActive || hasScannerError) {
      console.log('[BarcodeScanning] Cannot start scan due to state:', { 
        cameraActive, isScanningActive, hasScannerError 
      });
      return false;
    }
    
    console.log('[BarcodeScanning] Starting scan...');
    setHasScannerError(null);
    
    try {
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        throw new Error('MLKit Barcode Scanner not available');
      }
      
      // Set up the barcode listener
      const listener = await BarcodeScanner.addListener(
        'barcodeScanned',
        async result => {
          try {
            const code = result.barcode.displayValue || result.barcode.rawValue;
            
            console.log('[BarcodeScanning] Barcode detected:', code);
            setLastScannedCode(code);
            
            // Call the onScan callback with the scanned code
            if (code) {
              onScan(code);
            }
            
            // Stop scanning after successful scan
            await stopScan();
          } catch (error) {
            console.error('[BarcodeScanning] Error processing scan result:', error);
          }
        }
      );
      
      // Start the scanner
      await BarcodeScanner.startScan();
      setIsScanningActive(true);
      console.log('[BarcodeScanning] Scan started successfully');
      return true;
    } catch (error) {
      console.error('[BarcodeScanning] Error starting scan:', error);
      setHasScannerError(true);
      setIsScanningActive(false);
      
      await Toast.show({
        text: 'فشل في بدء المسح الضوئي',
        duration: 'long'
      });
      
      return false;
    }
  }, [cameraActive, isScanningActive, hasScannerError, onScan, setHasScannerError, setIsScanningActive]);
  
  // إيقاف المسح
  const stopScan = useCallback(async (): Promise<boolean> => {
    if (!isScanningActive) {
      return true;
    }
    
    console.log('[BarcodeScanning] Stopping scan...');
    
    try {
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        await BarcodeScanner.stopScan();
        await BarcodeScanner.removeAllListeners();
      }
      
      setIsScanningActive(false);
      console.log('[BarcodeScanning] Scan stopped successfully');
      return true;
    } catch (error) {
      console.error('[BarcodeScanning] Error stopping scan:', error);
      setIsScanningActive(false);
      return false;
    }
  }, [isScanningActive, setIsScanningActive]);

  return {
    startScan,
    stopScan,
    lastScannedCode
  };
};
