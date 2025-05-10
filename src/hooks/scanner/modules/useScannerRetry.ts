
import { useCallback } from 'react';

interface UseScannerRetryProps {
  setHasScannerError: (error: boolean | string | null) => void;
  setCameraActive: (active: boolean) => void;
  activateCamera: () => Promise<boolean>;
  startScan: () => Promise<boolean>;
}

export const useScannerRetry = ({
  setHasScannerError,
  setCameraActive,
  activateCamera,
  startScan
}: UseScannerRetryProps) => {
  
  const handleRetry = useCallback(async () => {
    console.log('[Scanner] Attempting retry...');
    setHasScannerError(false);
    
    try {
      // Reset camera state
      setCameraActive(false);
      
      // Activate camera
      const cameraActivated = await activateCamera();
      
      if (cameraActivated) {
        // Start scanning if camera was activated successfully
        await startScan();
      }
      
      return cameraActivated;
    } catch (error) {
      console.error('[Scanner] Retry failed:', error);
      setHasScannerError(true);
      return false;
    }
  }, [setHasScannerError, setCameraActive, activateCamera, startScan]);
  
  return { handleRetry };
};
