
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
        
        // فحص الإذن باستخدام ملحق MLKitBarcodeScanner إذا كان متاحًا
        if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log("فحص إذن MLKitBarcodeScanner");
          const { camera } = await BarcodeScanner.checkPermissions();
          const isGranted = camera === 'granted';
          console.log("نتيجة فحص MLKitBarcodeScanner:", isGranted);
          setHasPermission(isGranted);
        } 
        // استخدام ملحق Camera إذا كان متاحًا
        else if (window.Capacitor?.isPluginAvailable('Camera')) {
          console.log("فحص إذن Camera");
          const { camera } = await Camera.checkPermissions();
          const isGranted = camera === 'granted';
          console.log("نتيجة فحص Camera:", isGranted);
          setHasPermission(isGranted);
        } 
        // في حالة التطوير على الويب، نفترض وجود الإذن
        else {
          console.log("تشغيل في بيئة الويب، جاري طلب إذن الكاميرا من المتصفح");
          try {
            // محاولة طلب إذن الكاميرا من المتصفح
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // تم منح الإذن، إغلاق التدفق فورًا
            stream.getTracks().forEach(track => track.stop());
            console.log("تم منح إذن كاميرا المتصفح");
            setHasPermission(true);
          } catch (error) {
            console.log("تم رفض إذن كاميرا المتصفح أو غير متاح:", error);
            setHasPermission(false);
          }
        }
      } catch (error) {
        console.error("خطأ في فحص الأذونات:", error);
        // نفترض عدم وجود الإذن في حالة حدوث خطأ
        setHasPermission(false);
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
        console.log("استخدام MLKitBarcodeScanner لطلب الإذن");
        const result = await BarcodeScanner.requestPermissions();
        const granted = result.camera === 'granted';
        console.log("نتيجة طلب إذن MLKitBarcodeScanner:", granted);
        setHasPermission(granted);
        
        if (!granted) {
          await Toast.show({
            text: 'الرجاء السماح بالوصول للكاميرا لاستخدام الماسح الضوئي',
            duration: 'long'
          });
        }
        
        return granted;
      } else if (window.Capacitor?.isPluginAvailable('Camera')) {
        console.log("استخدام Camera لطلب الإذن");
        const result = await Camera.requestPermissions({
          permissions: ['camera']
        });
        const granted = result.camera === 'granted';
        console.log("نتيجة طلب إذن Camera:", granted);
        setHasPermission(granted);
        
        if (!granted) {
          await Toast.show({
            text: 'الرجاء السماح بالوصول للكاميرا لاستخدام الماسح الضوئي',
            duration: 'long'
          });
        }
        
        return granted;
      }
      
      // في حالة التطوير على الويب
      console.log("محاولة طلب إذن الكاميرا من المتصفح");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // تم منح الإذن، إغلاق التدفق فورًا
        stream.getTracks().forEach(track => track.stop());
        console.log("تم منح إذن كاميرا المتصفح");
        setHasPermission(true);
        return true;
      } catch (error) {
        console.error("تم رفض إذن كاميرا المتصفح أو غير متاح:", error);
        setHasPermission(false);
        return false;
      }
    } catch (error) {
      console.error("خطأ في طلب الإذن:", error);
      // افتراض أنه لم يتم منح الإذن في حالة الخطأ
      setHasPermission(false);
      return false;
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
