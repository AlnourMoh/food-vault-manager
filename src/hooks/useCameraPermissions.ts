
import { useState, useEffect } from 'react';
import { Toast } from '@capacitor/toast';
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useCameraPermissions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // فحص الأذونات عند تحميل المكون
    const checkPermissions = async () => {
      try {
        setIsLoading(true);
        
        if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
          const { camera } = await BarcodeScanner.checkPermissions();
          setHasPermission(camera === 'granted');
        } else if (window.Capacitor?.isPluginAvailable('Camera')) {
          const { camera } = await Camera.checkPermissions();
          setHasPermission(camera === 'granted');
        } else {
          // في حالة التطوير على الويب، نفترض وجود الإذن
          console.log("تشغيل في بيئة الويب، افتراض وجود الإذن");
          setHasPermission(true);
        }
      } catch (error) {
        console.error("خطأ في فحص الأذونات:", error);
        // نفترض وجود الإذن في حالة حدوث خطأ لتجنب منع المستخدم
        setHasPermission(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPermissions();
  }, []);

  const requestCameraPermission = async () => {
    try {
      setIsLoading(true);
      console.log("طلب إذن الكاميرا");
      
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        const result = await BarcodeScanner.requestPermissions();
        const granted = result.camera === 'granted';
        setHasPermission(granted);
        
        if (!granted) {
          await Toast.show({
            text: 'الرجاء السماح بالوصول للكاميرا لاستخدام الماسح الضوئي',
            duration: 'long'
          });
        }
        
        return granted;
      } else if (window.Capacitor?.isPluginAvailable('Camera')) {
        const result = await Camera.requestPermissions();
        const granted = result.camera === 'granted';
        setHasPermission(granted);
        
        if (!granted) {
          await Toast.show({
            text: 'الرجاء السماح بالوصول للكاميرا لاستخدام الماسح الضوئي',
            duration: 'long'
          });
        }
        
        return granted;
      }
      
      // في حالة التطوير على الويب، نفترض وجود الإذن
      console.log("تشغيل في بيئة الويب، افتراض وجود الإذن");
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error("خطأ في طلب الإذن:", error);
      // نفترض وجود الإذن في حالة حدوث خطأ
      setHasPermission(true);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    hasPermission,
    requestPermission: requestCameraPermission
  };
};
