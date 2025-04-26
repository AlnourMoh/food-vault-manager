
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
        console.log('Initializing barcode scanner...');
        
        // Check if we're running on a device with Capacitor
        if (window.Capacitor) {
          try {
            // Check if MLKit barcode scanner is available
            const available = await MLKitBarcodeScanner.isSupported();
            console.log('MLKit BarcodeScanner available:', available);
            
            if (available) {
              // Pre-check camera permissions
              const permissions = await MLKitBarcodeScanner.checkPermissions();
              console.log('Camera permissions state:', permissions);
              
              if (permissions.camera === 'prompt') {
                console.log('Permission prompt will be shown');
              } else if (permissions.camera === 'denied') {
                console.log('Camera permission is denied');
                toast({
                  title: "إذن الكاميرا مرفوض",
                  description: "يرجى منح إذن الكاميرا في إعدادات التطبيق",
                  variant: "destructive"
                });
              }
            } else {
              console.log('MLKit scanner is NOT available on this device');
              toast({
                title: "ماسح الباركود غير متوفر",
                description: "جهازك لا يدعم ماسح الباركود، سيتم استخدام وضع الإدخال اليدوي",
                variant: "default"
              });
              // Automatically switch to manual mode if scanner isn't available
              setIsManualEntry(true);
            }
          } catch (error) {
            console.error('Error checking barcode scanner availability:', error);
          }
        } else {
          console.log('Running in web environment, using mock scanner');
        }
      } catch (error) {
        console.error('Error during scanner initialization:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeScanner();
    
    // Cleanup
    return () => {
      console.log('Barcode scanner component unmounting');
    };
  }, [toast]);
  
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
    console.log('BarcodeScanner state update - hasPermission:', hasPermission, 'isLoading:', isLoading, 'isScanningActive:', isScanningActive);
    
    const initializeScanner = async () => {
      try {
        if (!isLoading && !isInitializing) {
          if (hasPermission === true && !isScanningActive && !isManualEntry) {
            console.log('Auto-starting scanner because we have permission');
            await startScan();
          }
        }
      } catch (error) {
        console.error('Error initializing scanner:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تهيئة الماسح الضوئي",
          variant: "destructive"
        });
      }
    };
    
    initializeScanner();
    
    return () => {
      console.log('BarcodeScanner useEffect cleanup, stopping scan');
      stopScan();
    };
  }, [hasPermission, isLoading, isScanningActive, startScan, stopScan, isManualEntry, toast, isInitializing]);
  
  const handleRequestPermission = async () => {
    console.log('BarcodeScanner: Requesting permission explicitly...');
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
