
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';

export class PermissionStatusChecker {
  /**
   * التحقق من حالة إذن الكاميرا
   */
  public async checkPermissionStatus(): Promise<boolean> {
    try {
      console.log('PermissionStatusChecker: جاري التحقق من حالة إذن الكاميرا...');
      
      // في حالة بيئة الويب، نحاول التحقق باستخدام واجهة navigator.permissions إذا كانت متاحة
      if (!Capacitor.isNativePlatform()) {
        console.log('PermissionStatusChecker: نحن في بيئة الويب، محاولة التحقق من الإذن');
        
        try {
          // استخدام واجهة Permissions API للتحقق من الإذن إذا كانت متاحة
          if (navigator.permissions) {
            const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
            if (permissionStatus.state === 'granted') {
              console.log('PermissionStatusChecker: إذن الكاميرا في المتصفح ممنوح');
              return true;
            } else if (permissionStatus.state === 'denied') {
              console.log('PermissionStatusChecker: إذن الكاميرا في المتصفح مرفوض');
              return false;
            } else {
              console.log('PermissionStatusChecker: إذن الكاميرا في المتصفح انتظار، يرجى طلب الإذن');
              return false;
            }
          }
          
          // طريقة بديلة: محاولة الوصول إلى الكاميرا مباشرة للتحقق من الإذن
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          console.log('PermissionStatusChecker: تم الوصول للكاميرا، الإذن ممنوح');
          return true;
        } catch (error) {
          console.log('PermissionStatusChecker: تعذر الوصول للكاميرا، الإذن مرفوض أو لم يُطلب بعد');
          return false;
        }
      }
      
      // التحقق من حالة إذن BarcodeScanner في حالة توفره أولاً
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('PermissionStatusChecker: استخدام BarcodeScanner للتحقق من إذن الكاميرا');
        const result = await BarcodeScanner.checkPermissions();
        const isGranted = result.camera === 'granted';
        console.log('PermissionStatusChecker: نتيجة التحقق من BarcodeScanner:', isGranted);
        return isGranted;
      }
      
      // التحقق من حالة إذن الكاميرا باستخدام واجهة برمجة تطبيقات Camera
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('PermissionStatusChecker: استخدام Camera للتحقق من إذن الكاميرا');
        const result = await Camera.checkPermissions();
        const isGranted = result.camera === 'granted';
        console.log('PermissionStatusChecker: نتيجة التحقق من Camera:', isGranted);
        return isGranted;
      }
      
      console.log('PermissionStatusChecker: لا توجد واجهة برمجة تطبيقات للتحقق من إذن الكاميرا، سنفترض أن الإذن ممنوح للتجربة');
      return true; // افتراض منح الإذن إذا لم نتمكن من التحقق
    } catch (error) {
      console.error('PermissionStatusChecker: خطأ في التحقق من إذن الكاميرا:', error);
      return false;
    }
  }
}
