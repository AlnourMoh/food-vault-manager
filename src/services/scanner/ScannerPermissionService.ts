
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';

class ScannerPermissionService {
  private permissionDeniedCount: number = 0;
  
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    try {
      // أولاً نتحقق من توفر الملحقات
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const result = await BarcodeScanner.isSupported();
        return result.supported;
      }
      
      // نتحقق من توفر الكاميرا على الأقل
      if (Capacitor.isPluginAvailable('Camera')) {
        return true;
      }
      
      // في بيئة الويب، نتحقق من دعم الكاميرا
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return true;
      }
      
      // في حالة عدم توفر أي دعم
      return false;
    } catch (error) {
      console.error('خطأ في التحقق من دعم الماسح:', error);
      return false;
    }
  }
  
  /**
   * التحقق من حالة إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: جاري التحقق من حالة إذن الكاميرا...');
      
      // محاولة 1: استخدام ملحق MLKitBarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const status = await BarcodeScanner.checkPermissions();
        const hasPermission = status.camera === 'granted';
        console.log('ScannerPermissionService: نتيجة التحقق من MLKitBarcodeScanner:', hasPermission);
        return hasPermission;
      }
      
      // محاولة 2: استخدام ملحق Camera
      if (Capacitor.isPluginAvailable('Camera')) {
        const status = await Camera.checkPermissions();
        const hasPermission = status.camera === 'granted';
        console.log('ScannerPermissionService: نتيجة التحقق من Camera:', hasPermission);
        return hasPermission;
      }
      
      // محاولة 3: في بيئة الويب
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          
          // إيقاف المسار بعد التحقق
          stream.getTracks().forEach(track => track.stop());
          
          console.log('ScannerPermissionService: تم منح إذن كاميرا المتصفح');
          return true;
        } catch (error) {
          console.error('ScannerPermissionService: تم رفض إذن كاميرا المتصفح:', error);
          return false;
        }
      }
      
      // في حالة عدم وجود طريقة للتحقق، نفترض أن الإذن غير ممنوح
      console.log('ScannerPermissionService: لا يوجد وسيلة للتحقق من الإذن، نفترض أنه غير ممنوح');
      return false;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في التحقق من إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: جاري طلب إذن الكاميرا...');
      this.permissionDeniedCount++;
      
      // إذا تجاوزنا 3 محاولات، نحاول فتح الإعدادات مباشرة
      if (this.permissionDeniedCount > 3) {
        console.log('ScannerPermissionService: تجاوز الحد الأقصى للمحاولات، محاولة فتح الإعدادات');
        await Toast.show({
          text: 'يرجى تمكين إذن الكاميرا من إعدادات جهازك',
          duration: 'long'
        });
        
        return await this.openAppSettings();
      }
      
      // محاولة 1: استخدام ملحق MLKitBarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('ScannerPermissionService: محاولة طلب الإذن من MLKitBarcodeScanner...');
        
        const result = await BarcodeScanner.requestPermissions();
        const granted = result.camera === 'granted';
        
        console.log('ScannerPermissionService: نتيجة طلب إذن MLKitBarcodeScanner:', granted);
        
        if (granted) {
          this.permissionDeniedCount = 0;
          return true;
        }
      }
      
      // محاولة 2: استخدام ملحق Camera
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('ScannerPermissionService: محاولة طلب الإذن من Camera...');
        
        const result = await Camera.requestPermissions({
          permissions: ['camera']
        });
        const granted = result.camera === 'granted';
        
        console.log('ScannerPermissionService: نتيجة طلب إذن Camera:', granted);
        
        if (granted) {
          this.permissionDeniedCount = 0;
          return true;
        }
      }
      
      // محاولة 3: في بيئة الويب
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          console.log('ScannerPermissionService: محاولة طلب الإذن من متصفح الويب...');
          
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          
          // إيقاف المسار بعد التحقق
          stream.getTracks().forEach(track => track.stop());
          
          console.log('ScannerPermissionService: تم منح إذن كاميرا المتصفح');
          this.permissionDeniedCount = 0;
          return true;
        } catch (error) {
          console.error('ScannerPermissionService: تم رفض إذن كاميرا المتصفح:', error);
        }
      }
      
      // في حالة الوصول إلى هنا، لم يتم منح الإذن
      console.log('ScannerPermissionService: لم يتم منح الإذن');
      
      // بعد محاولتين، نقترح فتح الإعدادات
      if (this.permissionDeniedCount >= 2) {
        await Toast.show({
          text: 'يبدو أنك بحاجة إلى تمكين إذن الكاميرا من إعدادات جهازك',
          duration: 'long'
        });
        
        if (this.permissionDeniedCount >= 3) {
          await this.openAppSettings();
        }
      }
      
      return false;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * فتح إعدادات التطبيق
   */
  public async openAppSettings(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        console.log('ScannerPermissionService: محاولة فتح إعدادات التطبيق...');
        
        // التحقق من وجود الدالة في الإصدارات المختلفة من Capacitor
        const appSettings = App as any;
        if (typeof appSettings.openSettings === 'function') {
          await appSettings.openSettings();
          return true;
        } else {
          console.warn('ScannerPermissionService: دالة فتح الإعدادات غير متوفرة في هذا الإصدار من Capacitor');
          await Toast.show({
            text: 'يرجى فتح إعدادات جهازك يدوياً وتمكين إذن الكاميرا',
            duration: 'long'
          });
          return false;
        }
      } else {
        console.log('ScannerPermissionService: غير قادر على فتح الإعدادات في بيئة الويب');
        await Toast.show({
          text: 'يرجى تمكين إذن الكاميرا من إعدادات المتصفح',
          duration: 'long'
        });
        return false;
      }
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في فتح إعدادات التطبيق:', error);
      return false;
    }
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerPermissionService = new ScannerPermissionService();
