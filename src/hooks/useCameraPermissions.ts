
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

  // فحص الأذونات المبدئي وتبسيطه
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        console.log('[useCameraPermissions] فحص أولي سريع للأذونات...');
        setIsLoading(true);
        
        // افتراض أن الإذن موجود حتى نتأكد من العكس
        setHasPermission(true);
        
        if (window.Capacitor) {
          // محاولة استخدام MLKit أولاً للتحقق من الإذن
          try {
            const status = await BarcodeScanner.checkPermissions();
            if (status.camera === 'denied') {
              // إذا كان الإذن مرفوضاً بوضوح، نعلم المستخدم
              setHasPermission(false);
            }
          } catch (error) {
            // تجاهل الأخطاء في فحص الإذن، وافتراض أن الإذن سيتم طلبه لاحقاً
            console.warn('خطأ في فحص إذن MLKit:', error);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('خطأ في الفحص الأولي للأذونات:', error);
        // افتراض الإذن حتى عند حدوث خطأ، سيتم التعامل مع هذا عند فتح الكاميرا
        setHasPermission(true);
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, []);

  // وظيفة طلب الإذن مبسطة - تطلب الإذن مباشرة
  const requestCameraPermission = async (force = true) => {
    try {
      console.log(`[useCameraPermissions] طلب إذن الكاميرا مباشرة...`);
      setIsLoading(true);
      
      // محاولة مباشرة لطلب الإذن
      try {
        const permission = await BarcodeScanner.requestPermissions();
        if (permission.camera === 'granted') {
          setHasPermission(true);
          setIsLoading(false);
          return true;
        }
      } catch (mlkitError) {
        console.warn('خطأ في طلب إذن MLKit:', mlkitError);
      }

      // استخدام طلب الإذن العام كاحتياطي
      const result = await requestPermission(force);
      setHasPermission(result);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('خطأ في طلب إذن الكاميرا:', error);
      setIsLoading(false);
      
      // حتى مع حدوث خطأ، نحاول فتح الكاميرا
      setHasPermission(true);
      return true;
    }
  };

  return {
    isLoading,
    hasPermission,
    requestPermission: requestCameraPermission
  };
};
