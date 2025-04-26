
import React, { useEffect } from 'react';
import { useScannerInitialization } from './scanner/hooks/useScannerInitialization';
import { useScannerControls } from './scanner/hooks/useScannerControls';
import { ScannerContainer } from './scanner/ScannerContainer';
import { DigitalCodeInput } from './scanner/DigitalCodeInput';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const { isInitializing } = useScannerInitialization();
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
    handleRetry,
    isMockScanActive,
    handleManualInput
  } = useScannerControls({ onScan, onClose });

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      console.log('[BarcodeScanner] تنظيف المكون');
      document.body.style.background = '';
      document.body.classList.remove('barcode-scanner-active');
      document.body.classList.remove('scanner-transparent-background');
    };
  }, []);
  
  // لا نعرض شيئًا أثناء التهيئة
  if (isInitializing) {
    return null;
  }

  // Show manual input interface when mock scanning is active
  if (isMockScanActive) {
    return (
      <DigitalCodeInput 
        onSubmit={handleManualInput}
        onCancel={handleManualCancel}
      />
    );
  }

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
      handleRequestPermission={startScan}
      handleRetry={handleRetry}
    />
  );
};

export default BarcodeScanner;
