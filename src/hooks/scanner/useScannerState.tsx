
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';

// Define the props interface
export interface UseScannerStateProps {
  autoStart?: boolean;
  onScan?: (code: string) => void;
  onClose?: () => void;
}

export const useScannerState = (props?: UseScannerStateProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  const autoStart = props?.autoStart || false;
  const onScan = props?.onScan || ((code: string) => console.log('Scanned:', code));
  const onClose = props?.onClose || (() => {});
  
  // Helper function to start scanning
  const startScan = async (): Promise<boolean> => {
    try {
      setIsScanning(true);
      return true;
    } catch (error) {
      console.error('Error starting scan:', error);
      setIsScanning(false);
      return false;
    }
  };

  // Helper function to stop scanning
  const stopScan = async (): Promise<boolean> => {
    try {
      setIsScanning(false);
      return true;
    } catch (error) {
      console.error('Error stopping scan:', error);
      return false;
    }
  };
  
  const { toast } = useToast();

  return {
    isLoading,
    setIsLoading,
    hasError,
    setHasError,
    isScanning,
    setIsScanning,
    hasPermission,
    lastScannedCode,
    setLastScannedCode,
    startScan,
    stopScan,
    isScanningActive: isScanning
  };
};
