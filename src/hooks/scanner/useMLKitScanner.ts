
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Capacitor } from '@capacitor/core';
import { useScannerPermission } from './modules/useScannerPermission';
import { useScannerOperations } from './modules/useScannerOperations';
import { useScannerUI } from './modules/useScannerUI';

interface UseMLKitScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useMLKitScanner = ({ onScan, onClose }: UseMLKitScannerProps) => {
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  
  const { toast } = useToast();
  const { setupScannerBackground, restoreUIAfterScanning } = useScannerUI();
  
  // Initialize permission handling
  const {
    isLoading,
    hasPermission,
    permissionError,
    checkPermission,
    requestPermission,
    openSettings
  } = useScannerPermission();
  
  // Initialize scanner operations
  const {
    isScanning: isScanningActive,
    lastScannedCode,
    scanError,
    startScan: startScanOperation,
    stopScan: stopScanOperation,
    setLastScannedCode
  } = useScannerOperations();
  
  // Check if we're on a native platform
  const isNativePlatform = Capacitor.isNativePlatform();
  
  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopScan().catch(console.error);
    };
  }, []);
  
  // Handle scan errors
  useEffect(() => {
    if (scanError) {
      setHasScannerError(true);
      toast({
        title: "خطأ في المسح",
        description: scanError,
        variant: "destructive"
      });
    } else {
      setHasScannerError(false);
    }
  }, [scanError, toast]);

  // Start scanning process
  const startScan = useCallback(async (): Promise<boolean> => {
    try {
      // If not on a native platform, show a toast
      if (!isNativePlatform) {
        toast({
          title: "المسح غير متاح",
          description: "الماسح غير متاح في بيئة الويب",
          variant: "destructive"
        });
        return false;
      }
      
      // Check for permission first
      if (hasPermission !== true) {
        const granted = await requestPermission();
        if (!granted) {
          return false;
        }
      }
      
      // Setup UI for scanning
      await setupScannerBackground();
      
      // Start the scanning operation
      return await startScanOperation((code) => {
        // Handle successful scan
        setLastScannedCode(code);
        onScan(code);
      });
    } catch (error) {
      console.error('خطأ في بدء المسح:', error);
      setHasScannerError(true);
      
      toast({
        title: "خطأ في بدء المسح",
        description: "حدث خطأ غير متوقع أثناء بدء عملية المسح",
        variant: "destructive"
      });
      
      return false;
    }
  }, [
    isNativePlatform,
    hasPermission, 
    requestPermission, 
    setupScannerBackground, 
    startScanOperation,
    onScan,
    toast
  ]);

  // Stop scanning process
  const stopScan = useCallback(async (): Promise<boolean> => {
    try {
      // Stop scanning operation
      await stopScanOperation();
      
      // Restore UI
      await restoreUIAfterScanning();
      
      return true;
    } catch (error) {
      console.error('خطأ في إيقاف المسح:', error);
      return false;
    }
  }, [stopScanOperation, restoreUIAfterScanning]);

  // Handle manual entry toggle
  const handleManualEntry = useCallback(() => {
    setIsManualEntry(true);
  }, []);

  // Handle manual entry cancel
  const handleManualCancel = useCallback(() => {
    setIsManualEntry(false);
  }, []);

  // Handle retry after error
  const handleRetry = useCallback(() => {
    setHasScannerError(false);
    startScan().catch(console.error);
  }, [startScan]);

  // Handle request permission
  const handleRequestPermission = useCallback(async (): Promise<boolean> => {
    return await requestPermission();
  }, [requestPermission]);

  return {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    isManualEntry,
    hasScannerError,
    isNativePlatform,
    startScan,
    stopScan,
    handleManualEntry,
    handleManualCancel,
    handleRetry,
    handleRequestPermission,
    openSettings
  };
};
