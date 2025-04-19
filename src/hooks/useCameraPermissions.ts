
import { useState, useEffect } from 'react';
import { usePermissionCheck } from './scanner/permissions/usePermissionCheck';
import { usePermissionRequest } from './scanner/permissions/usePermissionRequest';
import { useToast } from './use-toast';

export const useCameraPermissions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { checkBarcodePermission, checkCameraPermission } = usePermissionCheck();
  const { requestPermission } = usePermissionRequest();
  const { toast } = useToast();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        console.log('[useCameraPermissions] فحص أذونات الكاميرا...');
        setIsLoading(true);

        // أولاً نتحقق من وجود BarcodeScanner
        if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
          console.log('[useCameraPermissions] ملحق BarcodeScanner متوفر، التحقق من الإذن...');
          
          // التحقق من الإذن باستخدام ملحق BarcodeScanner مباشرة
          const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
          const status = await BarcodeScanner.checkPermission({ force: false });
          
          console.log('[useCameraPermissions] حالة إذن BarcodeScanner:', status);
          setHasPermission(status.granted);
          
          // إذا لم يكن لدينا إذن ولم يتم طلبه من قبل، نطلبه تلقائيًا
          if (!status.granted && status.neverAsked) {
            console.log('[useCameraPermissions] لم يتم طلب الإذن من قبل، طلب الإذن تلقائيًا...');
            const granted = await requestPermission(true);
            setHasPermission(granted);
          }
          
          setIsLoading(false);
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
        toast({
          title: "خطأ في الأذونات",
          description: "حدث خطأ أثناء التحقق من أذونات الكاميرا",
          variant: "destructive"
        });
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
      setIsLoading(true);
      
      const result = await requestPermission(force);
      console.log('[useCameraPermissions] نتيجة طلب الإذن:', result);
      setHasPermission(result);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('[useCameraPermissions] خطأ في طلب الإذن:', error);
      setIsLoading(false);
      toast({
        title: "خطأ في طلب الإذن",
        description: "حدث خطأ أثناء محاولة طلب إذن الكاميرا",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    isLoading,
    hasPermission,
    requestPermission: requestCameraPermission
  };
};
