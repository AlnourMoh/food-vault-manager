
import { useState, useEffect } from 'react';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { useToast } from '@/hooks/use-toast';

interface UseZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

export const useZXingBarcodeScanner = ({
  onScan,
  onClose,
  autoStart = false
}: UseZXingBarcodeScannerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const { toast } = useToast();
  
  // Use the camera permissions hook
  const { hasPermission, requestPermission } = useCameraPermissions();
  
  // Effect to auto-start scanning if requested
  useEffect(() => {
    const initialize = async () => {
      // Short delay to allow UI to render
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsLoading(false);
      
      if (autoStart && hasPermission) {
        console.log('[useZXingBarcodeScanner] Auto-starting scan...');
        startScan().catch(console.error);
      }
    };
    
    initialize();
    
    // Cleanup on unmount
    return () => {
      if (isScanningActive) {
        stopScan().catch(console.error);
      }
    };
  }, [autoStart, hasPermission]);
  
  const startScan = async (): Promise<boolean> => {
    try {
      console.log('[useZXingBarcodeScanner] Starting scan...');
      
      // Check for permission first
      if (hasPermission === false) {
        console.log('[useZXingBarcodeScanner] No permission, requesting...');
        const granted = await requestPermission();
        if (!granted) {
          console.log('[useZXingBarcodeScanner] Permission denied');
          return false;
        }
      }
      
      // Set the camera and scanning active
      setCameraActive(true);
      setIsScanningActive(true);
      
      // In a real implementation, this would interact with the ZXing library
      // Here we're simulating a successful operation
      console.log('[useZXingBarcodeScanner] Scan started');
      return true;
      
    } catch (error) {
      console.error('[useZXingBarcodeScanner] Error starting scan:', error);
      setHasScannerError(true);
      return false;
    }
  };
  
  const stopScan = async (): Promise<boolean> => {
    try {
      setIsScanningActive(false);
      console.log('[useZXingBarcodeScanner] Scan stopped');
      return true;
    } catch (error) {
      console.error('[useZXingBarcodeScanner] Error stopping scan:', error);
      return false;
    }
  };
  
  const handleRetry = () => {
    setHasScannerError(false);
    startScan().catch(error => {
      console.error('[useZXingBarcodeScanner] Error during retry:', error);
      setHasScannerError(true);
    });
  };
  
  return {
    isLoading,
    hasPermission,
    isScanningActive,
    hasScannerError,
    cameraActive,
    startScan,
    stopScan,
    requestPermission,
    handleRetry
  };
};
