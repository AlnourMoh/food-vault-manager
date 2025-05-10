
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { AppSettingsOpener } from './AppSettingsOpener';

export class CameraPermissionRequester {
  private permissionAttempts = 0;
  private maxAttempts = 3;
  
  /**
   * طلب إذن الكاميرا مع معالجة متعددة المحاولات
   */
  public async requestPermission(): Promise<boolean> {
    try {
      console.log('CameraPermissionRequester: طلب إذن الكاميرا');
      this.permissionAttempts++;
      
      // التحقق من العدد الأقصى من المحاولات
      if (this.permissionAttempts > this.maxAttempts) {
        console.log(`CameraPermissionRequester: تم تجاوز الحد الأقصى من المحاولات (${this.maxAttempts})`);
        
        await Toast.show({
          text: 'سيتم توجيهك إلى إعدادات التطبيق لتمكين إذن الكاميرا يدوياً',
          duration: 'long'
        });
        
        return await AppSettingsOpener.openAppSettings();
      }
      
      // في بيئة الويب
      if (!Capacitor.isNativePlatform()) {
        console.log('CameraPermissionRequester: نحن في بيئة الويب');
        return await this.requestWebPermission();
      }
      
      // في الأجهزة الجوالة
      const platform = Capacitor.getPlatform();
      console.log(`CameraPermissionRequester: المنصة الحالية: ${platform}`);
      
      // محاولة استخدام MLKit أولاً
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const granted = await this.requestWithMLKit();
        if (granted) return true;
      }
      
      // ثم محاولة استخدام ملحق الكاميرا
      if (Capacitor.isPluginAvailable('Camera')) {
        const granted = await this.requestWithCamera();
        if (granted) return true;
      }
      
      // إذا فشلت كل المحاولات، نفتح إعدادات التطبيق
      console.log('CameraPermissionRequester: فشلت محاولات طلب الإذن، فتح الإعدادات');
      
      await Toast.show({
        text: 'يرجى تمكين إذن الكاميرا من إعدادات التطبيق',
        duration: 'long'
      });
      
      return await AppSettingsOpener.openAppSettings();
    } catch (error) {
      console.error('CameraPermissionRequester: خطأ غير متوقع في طلب الإذن:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا في بيئة الويب
   */
  private async requestWebPermission(): Promise<boolean> {
    if (!('mediaDevices' in navigator) || !('getUserMedia' in navigator.mediaDevices)) {
      console.log('CameraPermissionRequester: المتصفح لا يدعم واجهة mediaDevices');
      return false;
    }
    
    try {
      await Toast.show({
        text: 'سيطلب المتصفح منك السماح باستخدام الكاميرا. يرجى الموافقة.',
        duration: 'long'
      });
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // إغلاق المسار فورًا
      stream.getTracks().forEach(track => track.stop());
      
      console.log('CameraPermissionRequester: تم منح إذن كاميرا المتصفح بنجاح');
      
      await Toast.show({
        text: 'تم منح إذن الكاميرا بنجاح',
        duration: 'short'
      });
      
      return true;
    } catch (error) {
      console.error('CameraPermissionRequester: تم رفض إذن كاميرا المتصفح:', error);
      return false;
    }
  }
  
  /**
   * طلب الإذن باستخدام MLKit
   */
  private async requestWithMLKit(): Promise<boolean> {
    try {
      console.log('CameraPermissionRequester: استخدام MLKitBarcodeScanner');
      
      // التحقق من حالة الإذن الحالية
      const status = await BarcodeScanner.checkPermissions();
      if (status.camera === 'granted') {
        console.log('CameraPermissionRequester: إذن MLKit ممنوح بالفعل');
        return true;
      }
      
      // عرض رسالة توضيحية
      await Toast.show({
        text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
        duration: 'short'
      });
      
      // طلب الإذن
      const result = await BarcodeScanner.requestPermissions();
      console.log('CameraPermissionRequester: نتيجة طلب أذونات MLKit:', result);
      
      const granted = result.camera === 'granted';
      if (granted) {
        await Toast.show({
          text: 'تم منح إذن الكاميرا بنجاح',
          duration: 'short'
        });
      }
      
      return granted;
    } catch (error) {
      console.error('CameraPermissionRequester: خطأ في طلب أذونات MLKit:', error);
      return false;
    }
  }
  
  /**
   * طلب الإذن باستخدام ملحق الكاميرا
   */
  private async requestWithCamera(): Promise<boolean> {
    try {
      console.log('CameraPermissionRequester: استخدام ملحق الكاميرا');
      
      // التحقق من حالة الإذن الحالية
      const status = await Camera.checkPermissions();
      if (status.camera === 'granted') {
        console.log('CameraPermissionRequester: إذن الكاميرا ممنوح بالفعل');
        return true;
      }
      
      // عرض رسالة توضيحية
      await Toast.show({
        text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
        duration: 'short'
      });
      
      // طلب الإذن
      const result = await Camera.requestPermissions({ permissions: ['camera'] });
      console.log('CameraPermissionRequester: نتيجة طلب أذونات الكاميرا:', result);
      
      return result.camera === 'granted';
    } catch (error) {
      console.error('CameraPermissionRequester: خطأ في طلب أذونات الكاميرا:', error);
      return false;
    }
  }
}
