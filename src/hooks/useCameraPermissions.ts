
import { useState, useEffect } from 'react';
import { usePermissionCheck } from './scanner/permissions/usePermissionCheck';
import { usePermissionRequest } from './scanner/permissions/usePermissionRequest';
import { useToast } from './use-toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useCameraPermissions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { checkCameraPermission } = usePermissionCheck();
  const { requestPermission } = usePermissionRequest();
  const { toast } = useToast();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        console.log('[useCameraPermissions] فحص أذونات الكاميرا...');
        setIsLoading(true);

        // نتحقق من وجود مكتبة ML Kit
        if (window.Capacitor) {
          console.log('[useCameraPermissions] مكتبة ML Kit متوفرة، التحقق من الإذن...');
          
          try {
            const available = await BarcodeScanner.isSupported();
            
            if (available) {
              const status = await BarcodeScanner.checkPermissions();
              console.log('[useCameraPermissions] حالة إذن ML Kit:', status);
              setHasPermission(status.granted);
              setIsLoading(false);
              return;
            } else {
              console.log('[useCameraPermissions] مكتبة ML Kit غير مدعومة على هذا الجهاز');
            }
          } catch (error) {
            console.error('[useCameraPermissions] خطأ في التحقق من إذن ML Kit:', error);
          }
        }

        // إذا لم تكن مكتبة ML Kit متاحة، نستخدم ملحق الكاميرا
        console.log('[useCameraPermissions] محاولة التحقق من خلال ملحق الكاميرا');
        const cameraStatus = await checkCameraPermission();
        if (cameraStatus) {
          console.log('[useCameraPermissions] حالة إذن الكاميرا:', cameraStatus);
          setHasPermission(cameraStatus.granted);
          setIsLoading(false);
          return;
        }

        // لاختبار الويب، نفترض أن الإذن ممنوح
        console.log('[useCameraPermissions] ملحقات الكاميرا غير متوفرة، افتراض بيئة الويب');
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

  // طريقة مخصصة لطلب الإذن
  const requestCameraPermission = async (force = true) => {
    try {
      console.log(`[useCameraPermissions] طلب إذن الكاميرا صراحةً مع force=${force}...`);
      setIsLoading(true);
      
      // استخدام ملحق ML Kit الجديد
      if (window.Capacitor) {
        try {
          console.log('[useCameraPermissions] محاولة طلب إذن ML Kit...');
          const permission = await BarcodeScanner.requestPermissions();
          console.log('[useCameraPermissions] نتيجة طلب إذن ML Kit:', permission);
          
          if (permission.granted) {
            console.log('[useCameraPermissions] تم منح الإذن من ML Kit!');
            setHasPermission(true);
            setIsLoading(false);
            return true;
          }
        } catch (error) {
          console.error('[useCameraPermissions] خطأ في طلب إذن ML Kit:', error);
        }
      }
      
      // استخدام نظام طلب الإذن العام
      console.log('[useCameraPermissions] المحاولة المباشرة لم تنجح، استخدام requestPermission...');
      const result = await requestPermission(force);
      console.log('[useCameraPermissions] نتيجة طلب الإذن العام:', result);
      
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
