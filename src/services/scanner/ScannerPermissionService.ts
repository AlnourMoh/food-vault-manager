
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { scannerCameraService } from './ScannerCameraService';
import { AppSettingsOpener } from './permission/AppSettingsOpener';
import { Toast } from '@capacitor/toast';
import { App } from '@capacitor/app';

/**
 * خدمة إدارة أذونات الكاميرا للماسح الضوئي
 */
export class ScannerPermissionService {
  private static instance: ScannerPermissionService;
  private permissionRequestAttempts = 0;
  
  private constructor() {
    console.log('[ScannerPermissionService] تم إنشاء خدمة الأذونات');
  }
  
  /**
   * الحصول على مثيل الخدمة (Singleton)
   */
  public static getInstance(): ScannerPermissionService {
    if (!this.instance) {
      this.instance = new ScannerPermissionService();
    }
    return this.instance;
  }
  
  /**
   * التحقق من دعم الماسح الضوئي
   */
  public async isSupported(): Promise<boolean> {
    try {
      // إذا كنا في وضع المحاكاة، نعتبر الماسح مدعوماً دائماً
      if (scannerCameraService.isMockMode()) {
        return true;
      }
      
      // التحقق من دعم الماسح الضوئي في الجهاز
      if (Capacitor.isNativePlatform()) {
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          const result = await BarcodeScanner.isSupported();
          console.log('[ScannerPermissionService] MLKit مدعوم؟', result.supported);
          return result.supported;
        }
      }
      
      // للويب، نتحقق من وجود كاميرا
      if ('mediaDevices' in navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('[ScannerPermissionService] مكتشف وجود كاميرا في المتصفح');
        return true;
      }
      
      console.log('[ScannerPermissionService] الماسح الضوئي غير مدعوم على هذا الجهاز');
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من دعم الماسح:', error);
      return false;
    }
  }
  
  /**
   * التحقق من حالة إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] التحقق من إذن الكاميرا');
      
      // إذا كنا في وضع المحاكاة، نعتبر الإذن ممنوحاً دائماً
      if (scannerCameraService.isMockMode()) {
        console.log('[ScannerPermissionService] وضع المحاكاة، الإذن ممنوح افتراضياً');
        return true;
      }
      
      // التحقق من حالة الإذن حسب المنصة
      if (Capacitor.isNativePlatform()) {
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          const status = await BarcodeScanner.checkPermissions();
          console.log('[ScannerPermissionService] حالة إذن MLKit:', status);
          return status.camera === 'granted';
        }
      }
      
      // للويب، نحاول الوصول إلى الكاميرا
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          console.log('[ScannerPermissionService] محاولة الوصول إلى كاميرا المتصفح للتحقق من الإذن');
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // إيقاف المسارات فوراً بعد التحقق
          stream.getTracks().forEach(track => track.stop());
          console.log('[ScannerPermissionService] تم منح إذن كاميرا المتصفح');
          return true;
        } catch (error) {
          console.error('[ScannerPermissionService] تم رفض إذن كاميرا المتصفح:', error);
          return false;
        }
      }
      
      console.log('[ScannerPermissionService] لا يمكن التحقق من حالة الإذن، افتراض عدم وجود إذن');
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      this.permissionRequestAttempts++;
      console.log('[ScannerPermissionService] طلب إذن الكاميرا (محاولة رقم ' + this.permissionRequestAttempts + ')');
      
      // عرض إشعار للمستخدم
      await Toast.show({
        text: 'جارٍ طلب إذن الوصول إلى الكاميرا...',
        duration: 'short'
      });
      
      // إذا كنا في وضع المحاكاة، نعتبر الإذن ممنوحاً دائماً
      if (scannerCameraService.isMockMode()) {
        console.log('[ScannerPermissionService] وضع المحاكاة، الإذن ممنوح افتراضياً');
        return true;
      }
      
      // طلب الإذن حسب المنصة
      if (Capacitor.isNativePlatform()) {
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('[ScannerPermissionService] طلب إذن MLKit');
          
          // فحص حالة الإذن الحالية قبل طلبه مرة أخرى
          const currentStatus = await BarcodeScanner.checkPermissions();
          if (currentStatus.camera === 'granted') {
            console.log('[ScannerPermissionService] إذن MLKit ممنوح بالفعل');
            return true;
          }
          
          // فيما عدا ذلك، نطلب الإذن
          const result = await BarcodeScanner.requestPermissions();
          const granted = result.camera === 'granted';
          console.log('[ScannerPermissionService] نتيجة طلب إذن MLKit:', granted);
          
          // إذا لم يتم منح الإذن وكان عدد المحاولات كافٍ، نوجه المستخدم إلى الإعدادات
          if (!granted && this.permissionRequestAttempts >= 2) {
            console.log('[ScannerPermissionService] تعذر الحصول على إذن بعد عدة محاولات، توجيه المستخدم إلى الإعدادات');
            await Toast.show({
              text: 'يرجى تمكين إذن الكاميرا من إعدادات التطبيق',
              duration: 'long'
            });
            
            // السؤال قبل فتح الإعدادات
            const shouldOpenSettings = window.confirm(
              'لم يتم منح إذن الكاميرا. هل ترغب في فتح إعدادات التطبيق لتمكين الإذن يدوياً؟'
            );
            
            if (shouldOpenSettings) {
              return await this.openAppSettings();
            }
          }
          
          return granted;
        }
      }
      
      // للويب، نحاول الوصول إلى الكاميرا
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          console.log('[ScannerPermissionService] طلب إذن كاميرا المتصفح');
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // إيقاف المسارات فوراً بعد التحقق
          stream.getTracks().forEach(track => track.stop());
          console.log('[ScannerPermissionService] تم منح إذن كاميرا المتصفح');
          return true;
        } catch (error) {
          console.error('[ScannerPermissionService] تم رفض إذن كاميرا المتصفح:', error);
          return false;
        }
      }
      
      console.log('[ScannerPermissionService] لا يمكن طلب الإذن على هذه المنصة');
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * فتح إعدادات التطبيق للوصول إلى أذونات الكاميرا
   */
  public async openAppSettings(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] محاولة فتح إعدادات التطبيق');
      
      // إعلام المستخدم
      await Toast.show({
        text: 'جارٍ فتح إعدادات التطبيق، يرجى تمكين إذن الكاميرا',
        duration: 'long'
      });
      
      // فتح الإعدادات باستخدام الخدمة المساعدة
      return await AppSettingsOpener.openAppSettings();
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في فتح إعدادات التطبيق:', error);
      
      // إظهار إرشادات بديلة
      if (Capacitor.isNativePlatform()) {
        const platform = Capacitor.getPlatform();
        
        if (platform === 'android') {
          await Toast.show({
            text: 'يرجى فتح إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات، وتمكين إذن الكاميرا',
            duration: 'long'
          });
        } else if (platform === 'ios') {
          await Toast.show({
            text: 'يرجى فتح إعدادات جهازك > الخصوصية > الكاميرا، وتمكين إذن الكاميرا لتطبيق مخزن الطعام',
            duration: 'long'
          });
        }
      }
      
      return false;
    }
  }
}

// تصدير مثيل الخدمة
export const scannerPermissionService = ScannerPermissionService.getInstance();
