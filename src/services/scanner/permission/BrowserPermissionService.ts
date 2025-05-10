
import { Toast } from '@capacitor/toast';

export class BrowserPermissionService {
  /**
   * طلب إذن الكاميرا في بيئة المتصفح
   */
  public async requestBrowserPermission(): Promise<boolean> {
    try {
      console.log('BrowserPermissionService: طلب إذن الكاميرا في المتصفح');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('BrowserPermissionService: واجهة برمجة التطبيقات للوسائط غير مدعومة');
        
        await Toast.show({
          text: 'متصفحك لا يدعم الوصول إلى الكاميرا',
          duration: 'long'
        });
        
        return false;
      }
      
      try {
        // محاولة الوصول إلى الكاميرا
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        // إغلاق المسارات بعد التحقق من الإذن
        stream.getTracks().forEach(track => track.stop());
        
        console.log('BrowserPermissionService: تم منح إذن الكاميرا');
        return true;
      } catch (error) {
        console.error('BrowserPermissionService: تم رفض إذن الكاميرا أو غير متاح:', error);
        
        await Toast.show({
          text: 'تم رفض إذن الكاميرا، يرجى السماح بالوصول للكاميرا من إعدادات المتصفح',
          duration: 'long'
        });
        
        return false;
      }
    } catch (error) {
      console.error('BrowserPermissionService: خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }

  /**
   * التحقق من دعم الكاميرا في المتصفح
   */
  public async isBrowserCameraSupported(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false;
      }
      
      // التحقق من وجود كاميرات متصلة
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('BrowserPermissionService: خطأ في التحقق من دعم الكاميرا:', error);
      return false;
    }
  }
}
