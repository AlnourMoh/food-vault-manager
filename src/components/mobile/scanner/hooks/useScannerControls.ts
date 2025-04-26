
import { useState, useEffect } from 'react';
import { useScannerState } from '@/hooks/scanner/useScannerState';
import { useMockScanner } from '@/hooks/scanner/useMockScanner';

interface UseScannerControlsProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useScannerControls = ({ onScan, onClose }: UseScannerControlsProps) => {
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  
  const {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan
  } = useScannerState({ onScan, onClose });

  const {
    startMockScan,
    isMockScanActive,
    handleManualInput,
    cancelMockScan
  } = useMockScanner();

  // Auto-start scanner if permission is available and no errors
  useEffect(() => {
    if (!isLoading && hasPermission === true && !hasScannerError && !isScanningActive && !isManualEntry) {
      console.log('[useScannerControls] بدء المسح تلقائيًا بعد التحقق من الأذونات');
      const timeout = setTimeout(() => {
        startScan().catch(error => {
          console.error('[useScannerControls] خطأ في بدء المسح التلقائي:', error);
          setHasScannerError(true);
        });
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading, hasPermission, hasScannerError, isScanningActive]);

  const handleManualEntry = () => {
    console.log('[Scanner] التحويل إلى إدخال الكود يدويًا');
    stopScan();
    startMockScan(onScan);
  };

  const handleManualCancel = () => {
    console.log('[Scanner] تم إلغاء الإدخال اليدوي');
    cancelMockScan();
    setIsManualEntry(false);
  };

  const handleRetry = () => {
    console.log('[Scanner] إعادة المحاولة بعد خطأ');
    setHasScannerError(false);
    // Attempt to start scanning again after a short delay
    setTimeout(() => {
      startScan().catch(error => {
        console.error('[useScannerControls] خطأ في محاولة إعادة المسح:', error);
        setHasScannerError(true);
      });
    }, 500);
  };

  return {
    isManualEntry,
    hasScannerError,
    setHasScannerError,
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan,
    handleManualEntry,
    handleManualCancel,
    handleRetry,
    isMockScanActive,
    handleManualInput
  };
};
