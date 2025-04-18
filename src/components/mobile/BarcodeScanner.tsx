
import React, { useEffect } from 'react';
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
  
  // Automatically start scanning when the component mounts
  useEffect(() => {
    console.log('BarcodeScanner mounted, will auto-start scan');
    // Short delay to ensure everything is initialized properly
    const timer = setTimeout(() => {
      if (!isLoading && hasPermission && !isScanningActive) {
        console.log('Auto-starting scanner');
        startScan();
      }
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      stopScan();
    };
  }, [isLoading, hasPermission, isScanningActive, startScan, stopScan]);
  
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
