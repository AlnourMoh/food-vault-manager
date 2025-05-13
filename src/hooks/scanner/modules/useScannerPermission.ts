
import { useState, useEffect, useCallback } from 'react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';

export const useScannerPermission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Check permission on component mount
  useEffect(() => {
    checkPermission().catch(console.error);
  }, []);

  // Check camera permission
  const checkPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setPermissionError(null);

      const isSupported = await scannerPermissionService.isSupported();
      if (!isSupported) {
        setPermissionError('الجهاز لا يدعم الماسح الضوئي');
        setHasPermission(false);
        return false;
      }

      const permission = await scannerPermissionService.checkPermission();
      setHasPermission(permission);
      return permission;
    } catch (error) {
      console.error('خطأ في التحقق من الإذن:', error);
      setPermissionError('حدث خطأ أثناء التحقق من إذن الكاميرا');
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Request camera permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setPermissionError(null);

      const granted = await scannerPermissionService.requestPermission();
      setHasPermission(granted);

      if (!granted) {
        setPermissionError('تم رفض إذن الكاميرا');
        await Toast.show({
          text: 'يجب منح إذن الكاميرا لاستخدام الماسح الضوئي',
          duration: 'long'
        });
      }

      return granted;
    } catch (error) {
      console.error('خطأ في طلب الإذن:', error);
      setPermissionError('حدث خطأ أثناء طلب إذن الكاميرا');
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Open app settings to manually enable camera permission
  const openSettings = useCallback(async (): Promise<void> => {
    try {
      await scannerPermissionService.openAppSettings();
    } catch (error) {
      console.error('خطأ في فتح الإعدادات:', error);
      await Toast.show({
        text: 'تعذر فتح إعدادات التطبيق، يرجى تمكين إذن الكاميرا يدويًا',
        duration: 'long'
      });
    }
  }, []);

  return {
    isLoading,
    hasPermission,
    permissionError,
    checkPermission,
    requestPermission,
    openSettings
  };
};
