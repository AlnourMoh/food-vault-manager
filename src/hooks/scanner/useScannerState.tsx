
import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import '@/types/barcode-scanner-augmentation.d.ts';

export interface UseScannerStateProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

export const useScannerState = ({
  onScan,
  onClose,
  autoStart = false
}: UseScannerStateProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isScanning, setIsScanning] = useState(autoStart);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  
  const checkScannerSupport = useCallback(async () => {
    try {
      if (!Capacitor.isNativePlatform()) {
        return false;
      }
      
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[useScannerState] مكون MLKitBarcodeScanner غير متاح');
        return false;
      }
      
      const result = await BarcodeScanner.isSupported();
      return result.supported;
    } catch (error) {
      console.error('[useScannerState] خطأ في التحقق من دعم الماسح:', error);
      return false;
    }
  }, []);
  
  const startScan = useCallback(async () => {
    try {
      const isSupported = await checkScannerSupport();
      if (!isSupported) {
        setHasError(true);
        setIsLoading(false);
        return false;
      }
      
      const { camera } = await BarcodeScanner.checkPermissions();
      setHasPermission(camera === 'granted');
      
      if (camera !== 'granted') {
        const result = await BarcodeScanner.requestPermissions();
        setHasPermission(result.camera === 'granted');
        
        if (result.camera !== 'granted') {
          return false;
        }
      }
      
      setIsScanning(true);
      const result = await BarcodeScanner.scan();
      
      if (result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue;
        if (code) {
          setLastScannedCode(code);
          onScan(code);
        }
      }
      
      return true;
    } catch (error) {
      console.error('[useScannerState] خطأ في بدء المسح:', error);
      setHasError(true);
      setIsScanning(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkScannerSupport, onScan]);
  
  const stopScan = useCallback(async () => {
    try {
      setIsScanning(false);
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        await BarcodeScanner.enableTorch(false).catch(() => {});
        
        // Fixed: call stopScan without arguments
        await BarcodeScanner.stopScan();
      }
      
      return true;
    } catch (error) {
      console.error('[useScannerState] خطأ في إيقاف المسح:', error);
      return false;
    }
  }, []);
  
  const requestPermission = useCallback(async () => {
    try {
      const result = await BarcodeScanner.requestPermissions();
      const granted = result.camera === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('[useScannerState] خطأ في طلب الأذونات:', error);
      setHasPermission(false);
      return false;
    }
  }, []);

  return {
    isLoading,
    setIsLoading,
    hasError,
    setHasError,
    isScanning,
    setIsScanning,
    hasPermission,
    setHasPermission,
    lastScannedCode,
    setLastScannedCode,
    startScan,
    stopScan,
    requestPermission
  };
};
