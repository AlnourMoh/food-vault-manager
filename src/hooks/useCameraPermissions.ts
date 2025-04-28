
import { useState, useEffect } from 'react';
import { usePermissionCheck } from './scanner/permissions/usePermissionCheck';
import { usePermissionRequest } from './scanner/permissions/usePermissionRequest';
import { useToast } from './use-toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useCameraPermissions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(true); // نبدأ بافتراض وجود الإذن
  const { checkCameraPermission } = usePermissionCheck();
  const { requestPermission } = usePermissionRequest();
  const { toast } = useToast();

  // تبسيط فحص الأذونات المبدئي
  useEffect(() => {
    console.log('[useCameraPermissions] تجاوز الفحص الأولي للأذونات لتسريع الفتح...');
    setIsLoading(false);
  }, []);

  // وظيفة طلب الإذن مبسطة - تطلب الإذن مباشرة
  const requestCameraPermission = async (force = true) => {
    console.log(`[useCameraPermissions] طلب إذن الكاميرا مباشرة`);
    
    try {
      // محاولة مباشرة لطلب الإذن
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          await BarcodeScanner.requestPermissions();
          setHasPermission(true);
          return true;
        } catch (error) {
          console.warn('خطأ في طلب إذن MLKit:', error);
        }
      }

      // حتى مع حدوث خطأ، نحاول فتح الكاميرا
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('خطأ في طلب إذن الكاميرا:', error);
      
      // حتى مع حدوث خطأ، نحاول فتح الكاميرا
      setHasPermission(true);
      return true;
    }
  };

  return {
    isLoading: false, // دائمًا نعود بحالة عدم تحميل لتسريع الفتح
    hasPermission: true, // دائمًا نفترض وجود الإذن ونتعامل مع الأخطاء لاحقًا
    requestPermission: requestCameraPermission
  };
};
