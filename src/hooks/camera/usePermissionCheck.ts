
import { useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { usePermissionStatus } from './usePermissionStatus';

export const usePermissionCheck = (permissionStatus: ReturnType<typeof usePermissionStatus>) => {
  const { setIsLoading, setHasPermission } = permissionStatus;

  useEffect(() => {
    // فحص الأذونات عند تحميل المكون
    const checkPermissions = async () => {
      try {
        setIsLoading(true);
        
        // أولاً: تجربة ملحق MLKitBarcodeScanner
        if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log("فحص إذن MLKitBarcodeScanner");
          const { camera } = await BarcodeScanner.checkPermissions();
          const isGranted = camera === 'granted';
          console.log("نتيجة فحص MLKitBarcodeScanner:", isGranted);
          setHasPermission(isGranted);
          return;
        } 
        
        // ثانياً: تجربة ملحق Camera
        if (window.Capacitor?.isPluginAvailable('Camera')) {
          console.log("فحص إذن Camera");
          const { camera } = await Camera.checkPermissions();
          const isGranted = camera === 'granted';
          console.log("نتيجة فحص Camera:", isGranted);
          setHasPermission(isGranted);
          return;
        } 
        
        // في حالة التطوير على الويب، نفترض وجود الإذن مؤقتًا
        console.log("تشغيل في بيئة الويب، جاري طلب إذن الكاميرا من المتصفح");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          console.log("تم منح إذن كاميرا المتصفح");
          setHasPermission(true);
        } catch (error) {
          console.log("تم رفض إذن كاميرا المتصفح أو غير متاح:", error);
          setHasPermission(false);
        }
      } catch (error) {
        console.error("خطأ في فحص الأذونات:", error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPermissions();
  }, [setIsLoading, setHasPermission]);
};
