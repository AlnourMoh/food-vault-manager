
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
      
      // في حالة بيئة الويب، نقوم بتجربة واجهة برمجة تطبيقات الكاميرا
      if (!Capacitor.isNativePlatform()) {
        console.log('PermissionStatusChecker: نحن في بيئة الويب، سنقوم بالمحاكاة');
        
        // في بيئة الويب، نفترض أن الإذن ممنوح للتجربة
        // لا يمكن التحقق من حالة الإذن مسبقًا في معظم المتصفحات
        return true;
      }
      
      // التحقق من حالة إذن الكاميرا باستخدام واجهة برمجة تطبيقات Camera
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('PermissionStatusChecker: استخدام Camera للتحقق من إذن الكاميرا');
        const result = await Camera.checkPermissions();
        console.log('PermissionStatusChecker: نتيجة التحقق من Camera:', result.camera === 'granted');
        return result.camera === 'granted';
      }
      
      // التحقق من حالة إذن BarcodeScanner في حالة توفره
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('PermissionStatusChecker: استخدام BarcodeScanner للتحقق من إذن الكاميرا');
        const result = await BarcodeScanner.checkPermissions();
        console.log('PermissionStatusChecker: نتيجة التحقق من BarcodeScanner:', result.camera === 'granted');
        return result.camera === 'granted';
      }
      
      console.log('PermissionStatusChecker: لا توجد واجهة برمجة تطبيقات للتحقق من إذن الكاميرا، سنفترض أن الإذن ممنوح للتجربة');
      return true; // افتراض منح الإذن إذا لم نتمكن من التحقق
    } catch (error) {
      console.error('PermissionStatusChecker: خطأ في التحقق من إذن الكاميرا:', error);
      return false;
    }
  }
}
