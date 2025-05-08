
import { useState, useCallback } from 'react';
import { Toast } from '@capacitor/toast';

export const useScanOperations = (
  cameraActive: boolean, 
  activateCamera: () => Promise<boolean>, 
  setIsScanningActive: React.Dispatch<React.SetStateAction<boolean>>,
  setHasScannerError: React.Dispatch<React.SetStateAction<boolean>>,
  setCameraActive: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // بدء المسح مع التأكد من تفعيل الكاميرا أولاً
  const startScan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useScanOperations] بدء عملية المسح...');
      
      // تأكد من تفعيل الكاميرا أولاً
      if (!cameraActive) {
        const cameraActivated = await activateCamera();
        if (!cameraActivated) {
          return false;
        }
      }
      
      // تفعيل حالة المسح النشط
      setIsScanningActive(true);
      
      // إظهار إشعار لتوجيه المستخدم للمسح
      await Toast.show({
        text: 'وجّه الكاميرا إلى الباركود للمسح',
        duration: 'short'
      });
      
      return true;
    } catch (error) {
      console.error('[useScanOperations] خطأ في بدء المسح:', error);
      setIsScanningActive(false);
      setHasScannerError(true);
      
      await Toast.show({
        text: 'تعذر تفعيل الكاميرا، يرجى المحاولة مرة أخرى',
        duration: 'short'
      });
      
      return false;
    }
  }, [cameraActive, activateCamera, setIsScanningActive, setHasScannerError]);

  // إيقاف المسح
  const stopScan = useCallback(async (): Promise<boolean> => {
    setIsScanningActive(false);
    // إيقاف الكاميرا أيضًا عند إيقاف المسح
    setCameraActive(false);
    
    await Toast.show({
      text: 'تم إيقاف الماسح',
      duration: 'short'
    });
    
    return true;
  }, [setIsScanningActive, setCameraActive]);

  // إعادة المحاولة
  const handleRetry = useCallback((): void => {
    setHasScannerError(false);
    startScan();
  }, [startScan, setHasScannerError]);

  return {
    startScan,
    stopScan,
    handleRetry
  };
};
