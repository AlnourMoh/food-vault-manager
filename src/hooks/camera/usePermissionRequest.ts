
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { usePermissionStatus } from './usePermissionStatus';
import { useAppSettings } from './useAppSettings';

export const usePermissionRequest = (permissionStatus: ReturnType<typeof usePermissionStatus>) => {
  const { setIsLoading, setHasPermission, permissionDeniedCount, setPermissionDeniedCount } = permissionStatus;
  const { openAppSettings } = useAppSettings();

  const requestCameraPermission = async () => {
    try {
      setIsLoading(true);
      console.log("طلب إذن الكاميرا، المحاولة رقم:", permissionDeniedCount + 1);
      
      // تسجيل عدد المحاولات
      const attemptCount = permissionDeniedCount + 1;
      
      // إذا تجاوزنا 3 محاولات، نحاول فتح الإعدادات مباشرة
      if (attemptCount > 3) {
        console.log("تجاوز عدد المحاولات، فتح الإعدادات مباشرة");
        await Toast.show({
          text: 'حاولت عدة مرات، يبدو أنك بحاجة لتمكين الإذن يدوياً من إعدادات جهازك',
          duration: 'short'
        });
        
        const opened = await openAppSettings();
        return opened;
      }
      
      // استراتيجية متعددة للمحاولة - على أساس المنصة
      
      // 1. في بيئة الويب
      if (!Capacitor.isNativePlatform()) {
        console.log("محاولة طلب إذن الكاميرا في المتصفح");
        
        // إذا كان المتصفح يدعم واجهات برمجة الكاميرا
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // تم منح الإذن، إغلاق التدفق فورًا
            stream.getTracks().forEach(track => track.stop());
            console.log("تم منح إذن كاميرا المتصفح");
            setHasPermission(true);
            setPermissionDeniedCount(0);
            return true;
          } catch (error) {
            console.error("تم رفض إذن كاميرا المتصفح:", error);
            setHasPermission(false);
            setPermissionDeniedCount(prev => prev + 1);
            
            // عرض رسالة للمستخدم
            await Toast.show({
              text: 'تم رفض إذن الكاميرا. يرجى تمكينه من إعدادات المتصفح.',
              duration: 'long'
            });
            return false;
          }
        } else {
          console.warn("المتصفح لا يدعم واجهة mediaDevices");
          setHasPermission(false);
          await Toast.show({
            text: 'متصفحك لا يدعم الوصول إلى الكاميرا.',
            duration: 'long'
          });
          return false;
        }
      }
      
      // 2. في بيئة التطبيق الأصلي
      let granted = false;
      
      // محاولة استخدام MLKitBarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log("استخدام MLKitBarcodeScanner لطلب الإذن");
        
        // عرض رسالة توضيحية
        await Toast.show({
          text: 'التطبيق يحتاج لإذن الكاميرا لمسح الباركود',
          duration: 'short'
        });
        
        // طلب الإذن
        const result = await BarcodeScanner.requestPermissions();
        granted = result.camera === 'granted';
        console.log("نتيجة طلب إذن MLKitBarcodeScanner:", granted);
        
        if (granted) {
          setHasPermission(true);
          setPermissionDeniedCount(0);
          return true;
        }
      }
      
      // إذا لم ننجح، جرب ملحق الكاميرا
      if (!granted && Capacitor.isPluginAvailable('Camera')) {
        console.log("استخدام Camera لطلب الإذن");
        
        // عرض رسالة توضيحية
        await Toast.show({
          text: 'يرجى السماح باستخدام الكاميرا لمسح الباركود',
          duration: 'short'
        });
        
        // طلب الإذن
        const result = await Camera.requestPermissions({
          permissions: ['camera']
        });
        granted = result.camera === 'granted';
        console.log("نتيجة طلب إذن Camera:", granted);
        
        if (granted) {
          setHasPermission(true);
          setPermissionDeniedCount(0);
          return true;
        }
      }
      
      // زيادة عداد المحاولات الفاشلة
      setPermissionDeniedCount(prev => prev + 1);
      setHasPermission(false);
      
      // إذا وصلنا إلى هنا، فإن الإذن تم رفضه
      console.log("تم رفض إذن الكاميرا في جميع المحاولات");
      
      // عرض رسالة توضيحية للمستخدم
      await Toast.show({
        text: 'لم يتم منح إذن الكاميرا. يرجى تمكينه من إعدادات جهازك للمتابعة.',
        duration: 'long'
      });
      
      // بعد محاولتين، نوجه المستخدم لإعدادات التطبيق
      if (attemptCount >= 2) {
        console.log("محاولة فتح الإعدادات بعد رفض متكرر");
        setTimeout(() => openAppSettings(), 1500);
      }
      
      return false;
    } catch (error) {
      console.error("خطأ في طلب الإذن:", error);
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { requestCameraPermission };
};
