
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
  const [isInitializing, setIsInitializing] = useState(true);
  
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
    console.log('BarcodeScanner mounted, hasPermission:', hasPermission);
    
    const initializeScanner = async () => {
      try {
        // Short delay to ensure everything is initialized properly
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (hasPermission !== null) {
          setIsInitializing(false);
          
          if (hasPermission === true && !isScanningActive && !isManualEntry) {
            console.log('Auto-starting scanner');
            await startScan();
          }
        }
      } catch (error) {
        console.error('Error initializing scanner:', error);
        setIsInitializing(false);
      }
    };
    
    initializeScanner();
    
    return () => {
      console.log('BarcodeScanner unmounting, stopping scan');
      stopScan();
    };
  }, [hasPermission, isScanningActive, startScan, stopScan, isManualEntry]);
  
  const handleRequestPermission = async () => {
    console.log('BarcodeScanner: request permission triggered');
    if (requestPermission) {
      try {
        console.log('Calling requestPermission function');
        const granted = await requestPermission();
        console.log('Permission request result:', granted);
        
        if (granted && !isScanningActive) {
          console.log('Permission granted, starting scan');
          await startScan();
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    }
  };
  
  const handleManualEntry = () => {
    console.log('Switching to manual code entry');
    stopScan(); // Make sure to stop any active scanning
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
  
  if (isInitializing) {
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
