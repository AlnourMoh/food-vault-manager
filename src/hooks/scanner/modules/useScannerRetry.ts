
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
  
  // وظيفة لإعادة المحاولة بعد حدوث خطأ
  const handleRetry = useCallback(() => {
    console.log('useScannerRetry: إعادة المحاولة بعد حدوث خطأ...');
    setHasScannerError(false);
    setCameraActive(false);
    
    // محاولة تفعيل الكاميرا وبدء المسح مجدداً
    setTimeout(() => {
      activateCamera().then(activated => {
        if (activated) {
          startScan();
        }
      });
    }, 500);
  }, [activateCamera, startScan, setCameraActive, setHasScannerError]);
  
  return {
    handleRetry
  };
};
