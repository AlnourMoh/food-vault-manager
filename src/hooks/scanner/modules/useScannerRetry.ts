
import { useCallback } from 'react';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

interface UseScannerRetryProps {
  setHasScannerError: (error: string | null) => void;
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
    console.log('[useScannerRetry] محاولة إعادة تشغيل الماسح الضوئي...');
    
    try {
      // إعادة تعيين حالة الخطأ أولاً
      setHasScannerError(null);
      
      // عرض رسالة للمستخدم
      if (Capacitor.isNativePlatform()) {
        await Toast.show({
          text: 'جاري إعادة تشغيل الماسح الضوئي...',
          duration: 'short'
        });
      }
      
      // محاولة تفعيل الكاميرا
      console.log('[useScannerRetry] محاولة تفعيل الكاميرا...');
      const cameraActivated = await activateCamera();
      
      if (!cameraActivated) {
        console.error('[useScannerRetry] فشلت محاولة تفعيل الكاميرا');
        setHasScannerError('فشلت محاولة تفعيل الكاميرا');
        
        if (Capacitor.isNativePlatform()) {
          await Toast.show({
            text: 'فشلت محاولة تفعيل الكاميرا، يرجى المحاولة مرة أخرى',
            duration: 'short'
          });
        }
        
        return;
      }
      
      // الانتظار لحظة قصيرة قبل بدء المسح
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // محاولة بدء المسح
      console.log('[useScannerRetry] محاولة بدء المسح...');
      const scanStarted = await startScan();
      
      if (!scanStarted) {
        console.error('[useScannerRetry] فشل بدء المسح');
        setHasScannerError('فشل بدء المسح');
        
        if (Capacitor.isNativePlatform()) {
          await Toast.show({
            text: 'فشل بدء المسح، يرجى المحاولة مرة أخرى',
            duration: 'short'
          });
        }
      } else {
        console.log('[useScannerRetry] تم إعادة تشغيل الماسح الضوئي بنجاح');
        
        if (Capacitor.isNativePlatform()) {
          await Toast.show({
            text: 'تم إعادة تشغيل الماسح الضوئي بنجاح',
            duration: 'short'
          });
        }
      }
    } catch (error) {
      console.error('[useScannerRetry] خطأ في إعادة المحاولة:', error);
      setHasScannerError('حدث خطأ أثناء محاولة إعادة التشغيل');
      
      if (Capacitor.isNativePlatform()) {
        await Toast.show({
          text: 'حدث خطأ أثناء محاولة إعادة التشغيل',
          duration: 'short'
        });
      }
    }
  }, [setHasScannerError, activateCamera, startScan, setCameraActive]);

  return { handleRetry };
};
