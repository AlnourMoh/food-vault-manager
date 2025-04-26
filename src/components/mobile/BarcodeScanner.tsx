
import React, { useEffect, useState } from 'react';
import { useScannerState } from '@/hooks/scanner/useScannerState';
import { ScannerLoading } from './scanner/ScannerLoading';
import { NoPermissionView } from './scanner/NoPermissionView';
import { ScannerView } from './scanner/ScannerView';
import { ScannerReadyView } from './scanner/ScannerReadyView';
import { DigitalCodeInput } from './scanner/DigitalCodeInput';
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner as MLKitBarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();
  
  // Handle scanner initialization
  useEffect(() => {
    const initializeScanner = async () => {
      try {
        // Check if we're running on a device with Capacitor
        if (window.Capacitor) {
          const available = await MLKitBarcodeScanner.isSupported();
          console.log('MLKit BarcodeScanner available:', available);
          
          if (available) {
            // Pre-check camera permissions
            const permissions = await MLKitBarcodeScanner.checkPermissions();
            console.log('Camera permissions state:', permissions);
          }
        }
      } catch (error) {
        console.error('Error during scanner initialization:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeScanner();
  }, []);
  
  const {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan
  } = useScannerState({ onScan, onClose });
  
  // Automatically start scanning when the component mounts if we have permission
  useEffect(() => {
    console.log('BarcodeScanner mounted, hasPermission:', hasPermission, 'isLoading:', isLoading);
    
    const initializeScanner = async () => {
      try {
        if (!isLoading) {
          setIsInitializing(false);
          
          if (hasPermission === true && !isScanningActive && !isManualEntry) {
            console.log('Auto-starting scanner because we have permission');
            await startScan();
          }
        }
      } catch (error) {
        console.error('Error initializing scanner:', error);
        setIsInitializing(false);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تهيئة الماسح الضوئي",
          variant: "destructive"
        });
      }
    };
    
    initializeScanner();
    
    return () => {
      console.log('BarcodeScanner unmounting, stopping scan');
      stopScan();
    };
  }, [hasPermission, isLoading, isScanningActive, startScan, stopScan, isManualEntry, toast]);
  
  const handleRequestPermission = async () => {
    console.log('BarcodeScanner: Requesting permission...');
    try {
      console.log('Starting permission request and scan workflow');
      const result = await startScan();
      console.log('Permission request and scan result:', result);
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast({
        title: "خطأ في الإذن",
        description: "حدث خطأ أثناء طلب إذن الكاميرا",
        variant: "destructive"
      });
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
  
  if (isInitializing || isLoading) {
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
