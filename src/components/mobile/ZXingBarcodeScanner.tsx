
import React, { useEffect, useState } from 'react';
import { useScannerControls } from './scanner/hooks/useScannerControls';
import { ScannerContainer } from './scanner/ScannerContainer';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ 
  onScan, 
  onClose,
  autoStart = false
}) => {
  const {
    isManualEntry,
    hasScannerError,
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan,
    handleManualEntry,
    handleManualCancel,
    handleRequestPermission,
    handleRetry
  } = useScannerControls({ onScan, onClose });

  const [isInitialized, setIsInitialized] = useState(false);

  // تفعيل المسح تلقائيًا عند تحميل المكون إذا كانت خاصية autoStart = true
  useEffect(() => {
    if (autoStart && !isInitialized && !isLoading && hasPermission !== false) {
      console.log('ZXingBarcodeScanner: بدء المسح تلقائياً');
      setIsInitialized(true);
      
      // تأخير قصير جدًا للسماح بتحميل واجهة المستخدم
      const timer = setTimeout(() => {
        startScan().catch(console.error);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [autoStart, isInitialized, isLoading, hasPermission]);

  return (
    <ScannerContainer
      isManualEntry={isManualEntry}
      hasScannerError={hasScannerError}
      isLoading={isLoading}
      hasPermission={hasPermission}
      isScanningActive={isScanningActive}
      lastScannedCode={lastScannedCode}
      onScan={onScan}
      onClose={onClose}
      startScan={startScan}
      stopScan={stopScan}
      handleManualEntry={handleManualEntry}
      handleManualCancel={handleManualCancel}
      handleRequestPermission={handleRequestPermission}
      handleRetry={handleRetry}
    />
  );
};

export default ZXingBarcodeScanner;
