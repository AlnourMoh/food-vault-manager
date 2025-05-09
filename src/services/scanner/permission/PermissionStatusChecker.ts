
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export class PermissionStatusChecker {
  /**
   * التحقق من حالة إذن الكاميرا
   */
  public async checkPermissionStatus(): Promise<boolean> {
    try {
      console.log('PermissionStatusChecker: جاري التحقق من حالة إذن الكاميرا...');
      
      // محاولة 1: استخدام ملحق MLKitBarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const status = await BarcodeScanner.checkPermissions();
        const hasPermission = status.camera === 'granted';
        console.log('PermissionStatusChecker: نتيجة التحقق من MLKitBarcodeScanner:', hasPermission);
        return hasPermission;
      }
      
      // محاولة 2: استخدام ملحق Camera
      if (Capacitor.isPluginAvailable('Camera')) {
        const status = await Camera.checkPermissions();
        const hasPermission = status.camera === 'granted';
        console.log('PermissionStatusChecker: نتيجة التحقق من Camera:', hasPermission);
        return hasPermission;
      }
      
      // محاولة 3: في بيئة الويب
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          
          // إيقاف المسار بعد التحقق
          stream.getTracks().forEach(track => track.stop());
          
          console.log('PermissionStatusChecker: تم منح إذن كاميرا المتصفح');
          return true;
        } catch (error) {
          console.error('PermissionStatusChecker: تم رفض إذن كاميرا المتصفح:', error);
          return false;
        }
      }
      
      // في حالة عدم وجود طريقة للتحقق، نفترض أن الإذن غير ممنوح
      console.log('PermissionStatusChecker: لا يوجد وسيلة للتحقق من الإذن، نفترض أنه غير ممنوح');
      return false;
    } catch (error) {
      console.error('PermissionStatusChecker: خطأ في التحقق من إذن الكاميرا:', error);
      return false;
    }
  }
}
