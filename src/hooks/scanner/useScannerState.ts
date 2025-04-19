
import { useState, useEffect } from 'react';
import { useCameraPermissions } from '../useCameraPermissions';
import { useScannerDevice } from './useScannerDevice';

interface UseScannerStateProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useScannerState = ({ onScan, onClose }: UseScannerStateProps) => {
  const { isLoading, hasPermission, requestPermission } = useCameraPermissions();
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const { startDeviceScan, stopDeviceScan } = useScannerDevice();
  
  const handleSuccessfulScan = (code: string) => {
    console.log('Scan successful with code:', code);
    setLastScannedCode(code);
    stopScan();
    onScan(code);
  };
  
  const startScan = async () => {
    try {
      console.log('Attempting to start scan, permission status:', hasPermission);
      
      // If we don't have permission, request it
      if (hasPermission === false) {
        console.log('No camera permission, requesting...');
        const granted = await requestPermission();
        console.log('Permission request result:', granted);
        
        if (!granted) {
          console.log('Permission denied after request');
          return false;
        }
      }
      
      console.log('Permission OK, starting device scan');
      setIsScanningActive(true);
      await startDeviceScan(handleSuccessfulScan);
      return true;
    } catch (error) {
      console.error('Error starting scan:', error);
      setIsScanningActive(false);
      return false;
    }
  };
  
  const stopScan = async () => {
    console.log('Stopping scan');
    setIsScanningActive(false);
    await stopDeviceScan();
  };
  
  useEffect(() => {
    return () => {
      stopScan();
    };
  }, []);
  
  return {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan
  };
};
