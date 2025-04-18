
import React, { useEffect } from 'react';
import { useBarcodeScannerControls } from '@/hooks/scanner/useBarcodeScannerControls';
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
    isScanningActive, 
    lastScannedCode,
    hasPermission,
    startScan,
    stopScan,
    requestPermission
  } = useBarcodeScannerControls({ onScan, onClose });
  
  // Automatically start scanning when the component mounts
  useEffect(() => {
    console.log('BarcodeScanner mounted, will auto-start scan');
    
    // Short delay to ensure everything is initialized properly
    const timer = setTimeout(() => {
      if (hasPermission !== false && !isScanningActive) {
        console.log('Auto-starting scanner');
        startScan();
      }
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      stopScan();
    };
  }, [hasPermission, isScanningActive, startScan, stopScan]);
  
  if (hasPermission === null) {
    return <ScannerLoading />;
  }
  
  return (
    <div className={`fixed inset-0 z-50 ${isScanningActive ? 'scanning-active' : ''}`}>
      {isScanningActive ? (
        <ScannerView 
          onStop={stopScan} 
          hasPermissionError={hasPermission === false}
          onRequestPermission={requestPermission}
        />
      ) : (
        hasPermission === false ? (
          <NoPermissionView 
            onClose={onClose} 
            onRequestPermission={requestPermission}
          />
        ) : (
          <ScannerReadyView
            lastScannedCode={lastScannedCode}
            onStartScan={startScan}
            onClose={onClose}
          />
        )
      )}
    </div>
  );
};

export default BarcodeScanner;
