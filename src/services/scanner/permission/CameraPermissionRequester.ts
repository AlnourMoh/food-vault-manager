
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { AppSettingsOpener } from './AppSettingsOpener';

export class CameraPermissionRequester {
  private permissionAttempts = 0;
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      console.log('CameraPermissionRequester: طلب إذن الكاميرا');
      this.permissionAttempts++;
      
      // التحقق من العدد الأقصى من المحاولات لتجنب طلبات متكررة مزعجة
      if (this.permissionAttempts > 2) {
        console.log('CameraPermissionRequester: تم تجاوز الحد الأقصى من محاولات طلب الإذن');
        // محاولة فتح إعدادات التطبيق للحصول على الإذن يدوياً
        await Toast.show({
          text: 'سيتم توجيهك إلى إعدادات التطبيق لتمكين إذن الكاميرا يدوياً',
          duration: 'short'
        });
        return await AppSettingsOpener.openAppSettings();
      }
      
      // في حالة بيئة الويب نطلب الإذن من المتصفح
      if (!Capacitor.isNativePlatform()) {
        console.log('CameraPermissionRequester: نحن في بيئة الويب، استخدام API الويب');
        
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
          try {
            // نحاول الوصول إلى الكاميرا
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: {
                facingMode: 'environment' // استخدام الكاميرا الخلفية إن أمكن
              } 
            });
            
            // إغلاق المسار فوراً لأننا نحتاج فقط التحقق من الإذن
            stream.getTracks().forEach(track => track.stop());
            console.log('CameraPermissionRequester: تم منح إذن كاميرا المتصفح بنجاح');
            return true;
          } catch (error) {
            console.log('CameraPermissionRequester: تم رفض إذن كاميرا المتصفح:', error);
            return false;
          }
        }
        
        console.log('CameraPermissionRequester: لا يدعم المتصفح getUserMedia، لا يمكن استخدام الكاميرا');
        return false;
      }
      
      // في الأجهزة الجوالة
      // التحقق من توفر مكتبة MLKit أولاً
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('CameraPermissionRequester: استخدام MLKitBarcodeScanner لطلب الإذن');
        try {
          const result = await BarcodeScanner.requestPermissions();
          console.log('نتيجة طلب أذونات MLKit:', result);
          
          if (result.camera === 'granted') {
            return true;
          } else if (result.camera === 'denied') {
            console.log('تم رفض إذن MLKit، محاولة فتح الإعدادات');
            return await AppSettingsOpener.openAppSettings();
          }
        } catch (mlkitError) {
          console.error('خطأ في طلب أذونات MLKit:', mlkitError);
          // استمرار للطريقة التالية
        }
      }
      
      // استخدام ملحق الكاميرا كبديل
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('CameraPermissionRequester: استخدام Camera لطلب الإذن');
        try {
          const result = await Camera.requestPermissions({
            permissions: ['camera']
          });
          
          console.log('نتيجة طلب أذونات الكاميرا:', result);
          
          if (result.camera === 'granted') {
            return true;
          } else if (result.camera === 'denied') {
            console.log('تم رفض إذن الكاميرا، محاولة فتح الإعدادات');
            return await AppSettingsOpener.openAppSettings();
          }
        } catch (cameraError) {
          console.error('خطأ في طلب أذونات الكاميرا:', cameraError);
        }
      }
      
      // في حالة عدم توفر أي من المكتبات، نفتح الإعدادات
      console.warn('CameraPermissionRequester: لا يوجد ملحق متاح لطلب إذن الكاميرا، محاولة فتح الإعدادات');
      return await AppSettingsOpener.openAppSettings();
    } catch (error) {
      console.error('CameraPermissionRequester: خطأ في طلب الإذن:', error);
      return false;
    }
  }
}
