
import { Dispatch, SetStateAction, useCallback } from 'react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';

export const useScannerPermission = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setHasPermission: Dispatch<SetStateAction<boolean | null>>,
  setHasScannerError: Dispatch<SetStateAction<boolean>>,
) => {
  // تحقق من حالة الإذن عند تحميل المكون
  const checkPermissions = useCallback(async (autoStart: boolean, activateCamera: () => Promise<boolean>) => {
    try {
      setIsLoading(true);
      console.log('useScannerPermission: التحقق من حالة إذن الكاميرا...');
      
      // تسجيل للتشخيص
      console.log('useScannerPermission: جاري تحقق حالة إذن الكاميرا');
      
      // التحقق من دعم الماسح أولاً
      const isSupported = await scannerPermissionService.isSupported();
      if (!isSupported) {
        console.error('useScannerPermission: الماسح غير مدعوم على هذا الجهاز');
        setHasScannerError(true);
        setIsLoading(false);
        
        await Toast.show({
          text: 'الماسح غير مدعوم على جهازك، يرجى المحاولة على جهاز آخر',
          duration: 'long'
        });
        return;
      }
      
      // التحقق من حالة الإذن
      const permissionResult = await scannerPermissionService.checkPermission();
      console.log('useScannerPermission: نتيجة التحقق من الإذن:', permissionResult);
      
      setHasPermission(permissionResult);
      setIsLoading(false);
      
      // إذا كان الإذن ممنوحاً وتفعيل تلقائي مطلوب، نبدأ بتفعيل الكاميرا
      if (permissionResult === true && autoStart) {
        console.log('useScannerPermission: الإذن ممنوح، بدء تفعيل الكاميرا تلقائياً...');
        setTimeout(() => {
          activateCamera();
        }, 500);
      }
    } catch (error) {
      console.error('useScannerPermission: خطأ في التحقق من الأذونات:', error);
      setHasScannerError(true);
      setIsLoading(false);
    }
  }, [setIsLoading, setHasPermission, setHasScannerError]);
  
  // وظيفة لطلب إذن الكاميرا
  const requestPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      
      console.log('useScannerPermission: جاري طلب إذن الكاميرا...');
      
      // استخدام خدمة أذونات الماسح الضوئي العامة
      const granted = await scannerPermissionService.requestPermission();
      console.log('useScannerPermission: نتيجة طلب الإذن:', granted);
      
      setHasPermission(granted);
      setIsLoading(false);
      
      if (granted) {
        await Toast.show({
          text: 'تم منح إذن الكاميرا بنجاح!',
          duration: 'short'
        });
        return true;
      } else {
        await Toast.show({
          text: 'تم رفض إذن الكاميرا، لن يتمكن الماسح من العمل بدون هذا الإذن',
          duration: 'long'
        });
        return false;
      }
    } catch (error) {
      console.error('useScannerPermission: خطأ في طلب الإذن:', error);
      setHasScannerError(true);
      setIsLoading(false);
      return false;
    }
  }, [setIsLoading, setHasPermission, setHasScannerError]);

  return { checkPermissions, requestPermission };
};
