
import { useCallback } from 'react';

export interface UseScannerRetryProps {
  setHasScannerError: (hasError: boolean | string | null) => void;
  activateCamera: () => Promise<boolean>;
  startScan: () => Promise<boolean>;
}

export const useScannerRetry = ({
  setHasScannerError,
  activateCamera,
  startScan
}: UseScannerRetryProps) => {
  const handleRetry = useCallback(async () => {
    console.log('[useScannerRetry] محاولة إعادة تفعيل الماسح...');
    
    // إعادة تعيين حالة الخطأ
    setHasScannerError(false);
    
    try {
      // محاولة تفعيل الكاميرا
      const cameraActivated = await activateCamera();
      if (!cameraActivated) {
        console.error('[useScannerRetry] فشل في إعادة تفعيل الكاميرا');
        setHasScannerError('فشل في إعادة تفعيل الكاميرا');
        return false;
      }
      
      // محاولة بدء المسح
      const scanStarted = await startScan();
      if (!scanStarted) {
        console.error('[useScannerRetry] فشل في إعادة بدء المسح');
        setHasScannerError('فشل في إعادة بدء المسح');
        return false;
      }
      
      console.log('[useScannerRetry] تمت إعادة تفعيل الماسح بنجاح');
      return true;
    } catch (error) {
      console.error('[useScannerRetry] خطأ أثناء محاولة إعادة التفعيل:', error);
      setHasScannerError('حدث خطأ غير متوقع أثناء إعادة التفعيل');
      return false;
    }
  }, [setHasScannerError, activateCamera, startScan]);
  
  return {
    handleRetry
  };
};
