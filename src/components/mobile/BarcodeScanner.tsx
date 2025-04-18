
import React from 'react';
import { useScannerState } from '@/hooks/scanner/useScannerState';
import { ScannerLoading } from './scanner/ScannerLoading';
import { NoPermissionView } from './scanner/NoPermissionView';
import { ScannerView } from './scanner/ScannerView';
import { ScannerReadyView } from './scanner/ScannerReadyView';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const { 
    isLoading, 
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan
  } = useScannerState({ onScan, onClose });
  
  if (isLoading) {
    return <ScannerLoading />;
  }
  
  if (hasPermission === false) {
    return <NoPermissionView onClose={onClose} />;
  }
  
  return (
    <div className={`fixed inset-0 z-50 ${isScanningActive ? 'scanning-active' : ''}`}>
      {isScanningActive ? (
        <ScannerView onStop={stopScan} />
      ) : (
        <ScannerReadyView
          lastScannedCode={lastScannedCode}
          onStartScan={startScan}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default BarcodeScanner;
