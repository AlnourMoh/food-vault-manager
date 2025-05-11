
import { Toast } from '@capacitor/toast';
import { IPermissionHandler, PermissionResult } from './types';

/**
 * معالج أذونات الكاميرا للويب
 */
export class WebPermissionHandler implements IPermissionHandler {
  public isAvailable(): boolean {
    return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
  }

  public async checkPermission(): Promise<PermissionResult> {
    try {
      console.log('[WebPermissionHandler] فحص إذن الكاميرا في المتصفح');
      
      if (!this.isAvailable()) {
        console.warn('[WebPermissionHandler] واجهة getUserMedia غير متاحة في هذا المتصفح');
        return { isGranted: false, isDenied: true };
      }
      
      try {
        // محاولة الوصول إلى الكاميرا للتحقق من الإذن
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // إغلاق مسارات الكاميرا فوراً
        stream.getTracks().forEach(track => track.stop());
        return { isGranted: true, isDenied: false };
      } catch (error) {
        console.log('[WebPermissionHandler] تم رفض الوصول إلى الكاميرا في المتصفح:', error);
        return { isGranted: false, isDenied: true };
      }
    } catch (error) {
      console.error('[WebPermissionHandler] خطأ في التحقق من إذن الكاميرا:', error);
      return { isGranted: false, isDenied: true };
    }
  }

  public async requestPermission(): Promise<boolean> {
    try {
      console.log('[WebPermissionHandler] طلب إذن كاميرا المتصفح');
      
      if (!this.isAvailable()) {
        console.warn('[WebPermissionHandler] واجهة getUserMedia غير متاحة');
        return false;
      }
      
      await Toast.show({
        text: 'يرجى السماح للتطبيق باستخدام الكاميرا',
        duration: 'short'
      });
      
      // طلب الوصول إلى الكاميرا
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // إغلاق مسارات الكاميرا فوراً
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.log('[WebPermissionHandler] تم رفض الوصول إلى الكاميرا:', error);
      return false;
    }
  }
}
