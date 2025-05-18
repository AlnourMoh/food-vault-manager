
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

export const usePlatformPermissions = () => {
  const { toast } = useToast();
  
  // iOS-specific permission handling
  const handleIosPermissions = async (): Promise<boolean> => {
    console.log('[usePlatformPermissions] استخدام استراتيجية iOS للأذونات');
    
    try {
      // عرض رسالة توضيحية للأذونات على iOS
      await Toast.show({
        text: 'يرجى السماح بالوصول إلى الكاميرا للمتابعة',
        duration: 'short'
      }).catch(() => {});
      
      // محاولة استخدام مكتبة MLKit
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const status = await BarcodeScanner.requestPermissions();
        if (status.camera === 'granted') {
          return true;
        }
      }
      
      // الرجوع إلى Camera API إذا فشلت الطريقة الأولى
      if (Capacitor.isPluginAvailable('Camera')) {
        const status = await Camera.requestPermissions({
          permissions: ['camera']
        });
        return status.camera === 'granted';
      }
      
      return false;
    } catch (error) {
      console.error('[usePlatformPermissions] iOS permission error:', error);
      return false;
    }
  };
  
  // Android-specific permission handling
  const handleAndroidPermissions = async (): Promise<boolean> => {
    console.log('[usePlatformPermissions] استخدام استراتيجية Android للأذونات');
    
    try {
      // عرض رسالة توضيحية للأذونات على Android
      await Toast.show({
        text: 'التطبيق يحتاج إلى إذن الكاميرا لتشغيل الماسح الضوئي',
        duration: 'short'
      }).catch(() => {});
      
      // محاولة استخدام مكتبة MLKit
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const status = await BarcodeScanner.requestPermissions();
        if (status.camera === 'granted') {
          return true;
        }
      }
      
      // الرجوع إلى Camera API إذا فشلت الطريقة الأولى
      if (Capacitor.isPluginAvailable('Camera')) {
        const status = await Camera.requestPermissions({
          permissions: ['camera']
        });
        return status.camera === 'granted';
      }
      
      return false;
    } catch (error) {
      console.error('[usePlatformPermissions] Android permission error:', error);
      return false;
    }
  };
  
  // Web-specific permission handling
  const handleWebPermissions = async (): Promise<boolean> => {
    console.log('[usePlatformPermissions] استخدام استراتيجية المتصفح للأذونات');
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('[usePlatformPermissions] getUserMedia غير مدعوم في هذا المتصفح');
        toast({
          title: "تنبيه",
          description: "متصفحك لا يدعم الوصول إلى الكاميرا",
          variant: "destructive"
        });
        return false;
      }
      
      // محاولة الحصول على إذن الكاميرا في المتصفح
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        // إغلاق المسارات بعد الحصول على الإذن
        stream.getTracks().forEach(track => track.stop());
        
        console.log('[usePlatformPermissions] تم منح إذن كاميرا المتصفح بنجاح');
        return true;
      } catch (error) {
        console.error('[usePlatformPermissions] تم رفض إذن كاميرا المتصفح:', error);
        toast({
          title: "تنبيه",
          description: "تم رفض الوصول إلى الكاميرا",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('[usePlatformPermissions] Web permission error:', error);
      return false;
    }
  };

  return {
    handleIosPermissions,
    handleAndroidPermissions,
    handleWebPermissions
  };
};
