
import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';

export const usePermissionStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionDeniedCount, setPermissionDeniedCount] = useState(0);
  
  // إضافة وظيفة فحص الأذونات مباشرة هنا
  const checkPermission = useCallback(async (): Promise<boolean> => {
    try {
      console.log("فحص حالة إذن الكاميرا...");
      setIsLoading(true);
      
      // في بيئة الويب، نحاول استخدام واجهة المتصفح
      if (!Capacitor.isNativePlatform()) {
        try {
          console.log("فحص إذن الكاميرا في المتصفح");
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn("واجهة getUserMedia غير متاحة في هذا المتصفح");
            setHasPermission(false);
            return false;
          }
          
          // محاولة الوصول للكاميرا
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          
          // إغلاق المسارات فورًا بعد التحقق
          stream.getTracks().forEach(track => track.stop());
          
          console.log("تم منح إذن الكاميرا في المتصفح");
          setHasPermission(true);
          return true;
        } catch (error) {
          console.log("تم رفض إذن الكاميرا في المتصفح:", error);
          setHasPermission(false);
          return false;
        }
      }
      
      // في بيئة التطبيق الأصلي، نحاول أولاً استخدام BarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const status = await BarcodeScanner.checkPermissions();
        console.log("نتيجة فحص أذونات BarcodeScanner:", status);
        const granted = status.camera === 'granted';
        setHasPermission(granted);
        return granted;
      } 
      
      // ثم نجرب ملحق الكاميرا العادي
      if (Capacitor.isPluginAvailable('Camera')) {
        const status = await Camera.checkPermissions();
        console.log("نتيجة فحص أذونات Camera:", status);
        const granted = status.camera === 'granted';
        setHasPermission(granted);
        return granted;
      }
      
      // إذا وصلنا إلى هنا، فهذا يعني أنه لا توجد ملحقات للكاميرا متاحة
      console.warn("لا توجد ملحقات كاميرا متاحة في هذا الجهاز");
      setHasPermission(false);
      return false;
    } catch (error) {
      console.error("خطأ في فحص أذونات الكاميرا:", error);
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    setIsLoading,
    hasPermission,
    setHasPermission,
    permissionDeniedCount,
    setPermissionDeniedCount,
    checkPermission,
  };
};
