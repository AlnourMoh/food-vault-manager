
import { useCallback } from 'react';

interface UseScannerRetryProps {
  setHasScannerError: (error: boolean) => void;
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
    console.log('useScannerRetry: إعادة المحاولة...');
    
    // إعادة تعيين حالة الخطأ
    setHasScannerError(false);
    setCameraActive(false);
    
    // إعادة تنشيط الكاميرا
    const activated = await activateCamera();
    
    // إذا تم تنشيط الكاميرا بنجاح، نبدأ المسح
    if (activated) {
      console.log('useScannerRetry: تم إعادة تنشيط الكاميرا، نبدأ المسح الآن...');
      await startScan();
    }
  }, [setHasScannerError, setCameraActive, activateCamera, startScan]);
  
  return { handleRetry };
};
