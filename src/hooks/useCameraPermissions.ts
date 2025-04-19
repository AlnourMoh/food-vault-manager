
import { useState, useEffect } from 'react';
import { usePermissionCheck } from './scanner/permissions/usePermissionCheck';
import { usePermissionRequest } from './scanner/permissions/usePermissionRequest';

export const useCameraPermissions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { checkBarcodePermission, checkCameraPermission } = usePermissionCheck();
  const { requestPermission } = usePermissionRequest();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        console.log('[useCameraPermissions] فحص أذونات الكاميرا...');
        setIsLoading(true);

        // أولاً نحاول الفحص مع BarcodeScanner
        const barcodeStatus = await checkBarcodePermission();
        if (barcodeStatus) {
          console.log('[useCameraPermissions] حالة إذن الباركود:', barcodeStatus);
          setHasPermission(barcodeStatus.granted);
          setIsLoading(false);
          
          // إذا لم يتم منح الإذن، نحاول طلبه مرة واحدة لتسجيل التطبيق
          if (!barcodeStatus.granted && barcodeStatus.neverAsked) {
            console.log('[useCameraPermissions] لم يتم طلب الإذن من قبل، محاولة طلبه تلقائياً...');
            requestPermission(true);
          }
          return;
        }

        // إذا BarcodeScanner غير متوفر، نحاول مع ملحق الكاميرا
        const cameraStatus = await checkCameraPermission();
        if (cameraStatus) {
          console.log('[useCameraPermissions] حالة إذن الكاميرا:', cameraStatus);
          setHasPermission(cameraStatus.granted);
          setIsLoading(false);
          return;
        }

        // لاختبار الويب، نفترض أن الإذن ممنوح
        console.log('[useCameraPermissions] ملحقات الكاميرا الأصلية غير متوفرة، افتراض بيئة الويب');
        setHasPermission(true);
        setIsLoading(false);
      } catch (error) {
        console.error('[useCameraPermissions] خطأ في فحص أذونات الكاميرا:', error);
        setHasPermission(false);
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, []);

  // طريقة لطلب الإذن وتحديث الحالة وفقًا لذلك
  const requestCameraPermission = async (force = true) => {
    try {
      console.log(`[useCameraPermissions] طلب إذن الكاميرا صراحةً مع force=${force}...`);
      const result = await requestPermission(force);
      console.log('[useCameraPermissions] نتيجة طلب الإذن:', result);
      setHasPermission(result);
      return result;
    } catch (error) {
      console.error('[useCameraPermissions] خطأ في طلب الإذن:', error);
      return false;
    }
  };

  return {
    isLoading,
    hasPermission,
    requestPermission: requestCameraPermission
  };
};
