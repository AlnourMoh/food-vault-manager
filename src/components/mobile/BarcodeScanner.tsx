
import React, { useEffect } from 'react';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { useBarcodeScannerControls } from '@/hooks/useBarcodeScannerControls';
import { ScannerLoading } from './scanner/ScannerLoading';
import { NoPermissionView } from './scanner/NoPermissionView';
import { ScannerView } from './scanner/ScannerView';
import { ScannerReadyView } from './scanner/ScannerReadyView';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const { isLoading, hasPermission } = useCameraPermissions();
  const { isScanningActive, lastScannedCode, startScan, stopScan } = useBarcodeScannerControls({
    onScan,
    onClose
  });
  
  useEffect(() => {
    return () => {
      stopScan();
    };
  }, []);
  
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
