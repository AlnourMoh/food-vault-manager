
import { useState, useEffect } from 'react';
import { usePermissionCheck } from './scanner/permissions/usePermissionCheck';
import { usePermissionRequest } from './scanner/permissions/usePermissionRequest';
import { useToast } from './use-toast';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

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
          
          // طلب الإذن وتفعيل الصلاحية بشكل مباشر
          try {
            const status = await BarcodeScanner.checkPermission({ force: true });
            console.log('[useCameraPermissions] حالة إذن BarcodeScanner بعد طلب مباشر:', status);
            
            // تحديث حالة الإذن بناءً على النتيجة المباشرة
            setHasPermission(status.granted);
            setIsLoading(false);
            
            if (!status.granted) {
              console.log('[useCameraPermissions] لم يتم منح الإذن، سيتم طلبه مرة أخرى عند بدء المسح');
            }
            
            return;
          } catch (error) {
            console.error('[useCameraPermissions] خطأ في التحقق المباشر من إذن BarcodeScanner:', error);
          }
        }

        // إذا BarcodeScanner غير متوفر أو فشل، نحاول مع ملحق الكاميرا
        console.log('[useCameraPermissions] محاولة التحقق من خلال ملحق الكاميرا');
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

  // طريقة مخصصة لطلب الإذن
  const requestCameraPermission = async (force = true) => {
    try {
      console.log(`[useCameraPermissions] طلب إذن الكاميرا صراحةً مع force=${force}...`);
      setIsLoading(true);
      
      // محاولة مباشرة أولاً
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        try {
          console.log('[useCameraPermissions] محاولة مباشرة للحصول على إذن BarcodeScanner...');
          const status = await BarcodeScanner.checkPermission({ force: true });
          console.log('[useCameraPermissions] نتيجة المحاولة المباشرة:', status);
          
          if (status.granted) {
            console.log('[useCameraPermissions] تم منح الإذن مباشرة!');
            setHasPermission(true);
            setIsLoading(false);
            return true;
          }
        } catch (error) {
          console.error('[useCameraPermissions] خطأ في المحاولة المباشرة:', error);
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
