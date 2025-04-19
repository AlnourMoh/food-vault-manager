
import React, { useEffect, useState } from 'react';
import { useBarcodeScannerControls } from '@/hooks/scanner/useBarcodeScannerControls';
import { ScannerLoading } from './scanner/ScannerLoading';
import { NoPermissionView } from './scanner/NoPermissionView';
import { ScannerView } from './scanner/ScannerView';
import { ScannerReadyView } from './scanner/ScannerReadyView';
import { DigitalCodeInput } from './scanner/DigitalCodeInput';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const [isManualEntry, setIsManualEntry] = useState(false);
  
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
    console.log('Current permission status:', hasPermission);
    
    // Short delay to ensure everything is initialized properly
    const timer = setTimeout(() => {
      if (hasPermission !== false && !isScanningActive && !isManualEntry) {
        console.log('Auto-starting scanner');
        startScan();
      }
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      stopScan();
    };
  }, [hasPermission, isScanningActive, startScan, stopScan, isManualEntry]);
  
  const handleRequestPermission = async () => {
    console.log('BarcodeScanner: request permission triggered');
    if (requestPermission) {
      const granted = await requestPermission();
      console.log('Permission request result:', granted);
      
      if (granted && !isScanningActive) {
        console.log('Permission granted, starting scan');
        startScan();
      }
    }
  };
  
  const handleManualEntry = () => {
    console.log('Switching to manual code entry');
    setIsManualEntry(true);
  };
  
  const handleManualSubmit = (code: string) => {
    console.log('Manual code submitted:', code);
    onScan(code);
  };
  
  const handleManualCancel = () => {
    console.log('Manual entry canceled');
    setIsManualEntry(false);
  };
  
  if (isManualEntry) {
    return (
      <DigitalCodeInput 
        onSubmit={handleManualSubmit}
        onCancel={handleManualCancel}
      />
    );
  }
  
  if (hasPermission === null) {
    return <ScannerLoading />;
  }
  
  return (
    <div className={`fixed inset-0 z-50 ${isScanningActive ? 'scanning-active' : ''}`}>
      {isScanningActive ? (
        <ScannerView 
          onStop={stopScan} 
          hasPermissionError={hasPermission === false}
          onRequestPermission={handleRequestPermission}
          onManualEntry={handleManualEntry}
        />
      ) : (
        hasPermission === false ? (
          <NoPermissionView 
            onClose={onClose} 
            onRequestPermission={handleRequestPermission}
            onManualEntry={handleManualEntry}
          />
        ) : (
          <ScannerReadyView
            lastScannedCode={lastScannedCode}
            onStartScan={startScan}
            onClose={onClose}
            onManualEntry={handleManualEntry}
          />
        )
      )}
    </div>
  );
};

export default BarcodeScanner;
