
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { App } from '@capacitor/app';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';

/**
 * خدمة للتعامل مع أذونات الكاميرا للماسح الضوئي
 */
class ScannerPermissionService {
  private static instance: ScannerPermissionService;
  
  private constructor() {}
  
  public static getInstance(): ScannerPermissionService {
    if (!ScannerPermissionService.instance) {
      ScannerPermissionService.instance = new ScannerPermissionService();
    }
    return ScannerPermissionService.instance;
  }
  
  /**
   * فتح إعدادات التطبيق للسماح بتمكين الأذونات
   */
  public async openAppSettings(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] محاولة فتح إعدادات التطبيق...');
      
      const platform = Capacitor.getPlatform();
      
      // استخدام App API بدلاً من Camera.openSettings
      if (platform === 'android') {
        console.log('[ScannerPermissionService] محاولة فتح إعدادات Android...');
        try {
          await App.openUrl({
            url: 'package:' + (await App.getInfo()).id
          });
          return true;
        } catch (e) {
          console.error('[ScannerPermissionService] خطأ في فتح إعدادات Android:', e);
        }
      } else if (platform === 'ios') {
        console.log('[ScannerPermissionService] محاولة فتح إعدادات iOS...');
        try {
          await App.openUrl({
            url: 'app-settings:'
          });
          return true;
        } catch (e) {
          console.error('[ScannerPermissionService] خطأ في فتح إعدادات iOS:', e);
        }
      } else {
        console.log('[ScannerPermissionService] منصة غير مدعومة:', platform);
      }
      
      // استخدام BarcodeScanner للفتح إذا لم تنجح الطرق السابقة
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerPermissionService] محاولة فتح الإعدادات عبر BarcodeScanner...');
        try {
          await BarcodeScanner.openSettings();
          return true;
        } catch (e) {
          console.error('[ScannerPermissionService] خطأ في فتح إعدادات BarcodeScanner:', e);
        }
      }
      
      // إذا لم تنجح أي طريقة، نعرض رسالة للمستخدم
      await Toast.show({
        text: 'لم نتمكن من فتح إعدادات التطبيق تلقائيًا. يرجى فتح إعدادات هاتفك وتمكين إذن الكاميرا للتطبيق.',
        duration: 'long'
      });
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في فتح إعدادات التطبيق:', error);
      return false;
    }
  }
  
  /**
   * التحقق من دعم الماسح الضوئي على الجهاز
   */
  public async isSupported(): Promise<boolean> {
    try {
      // التحقق من توفر الكاميرا
      if (Capacitor.isPluginAvailable('Camera')) {
        return true;
      }
      
      // التحقق من توفر MLKit BarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const supported = await BarcodeScanner.isSupported();
          return supported;
        } catch (e) {
          console.error('[ScannerPermissionService] خطأ في التحقق من دعم MLKit:', e);
        }
      }
      
      // التحقق من توفر الكاميرا عبر navigator
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من دعم الماسح:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      // تحقق مما إذا كانت الكاميرا متوفرة
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('[ScannerPermissionService] محاولة طلب إذن الكاميرا...');
        
        // التحقق من حالة الإذن
        const status = await Camera.checkPermissions();
        
        if (status.camera === 'granted') {
          console.log('[ScannerPermissionService] إذن الكاميرا ممنوح بالفعل');
          return true;
        }
        
        // طلب الإذن
        const requestResult = await Camera.requestPermissions({
          permissions: ['camera']
        });
        
        // التحقق من نجاح الطلب
        if (requestResult.camera === 'granted') {
          console.log('[ScannerPermissionService] تم منح إذن الكاميرا بنجاح');
          return true;
        } else {
          console.log('[ScannerPermissionService] تم رفض إذن الكاميرا:', requestResult.camera);
          return false;
        }
      } else if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerPermissionService] محاولة طلب إذن MLKit BarcodeScanner...');
        
        // طلب إذن من MLKit BarcodeScanner
        const result = await BarcodeScanner.requestPermissions();
        
        if (result.camera === 'granted') {
          console.log('[ScannerPermissionService] تم منح إذن MLKit بنجاح');
          return true;
        } else {
          console.log('[ScannerPermissionService] تم رفض إذن MLKit:', result.camera);
          return false;
        }
      } else if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        console.log('[ScannerPermissionService] محاولة طلب إذن الكاميرا عبر navigator...');
        
        try {
          // طلب إذن الكاميرا عبر navigator
          await navigator.mediaDevices.getUserMedia({ video: true });
          console.log('[ScannerPermissionService] تم منح إذن الكاميرا عبر navigator بنجاح');
          return true;
        } catch (e) {
          console.log('[ScannerPermissionService] تم رفض إذن الكاميرا عبر navigator');
          return false;
        }
      } else {
        console.log('[ScannerPermissionService] لا يوجد دعم للكاميرا');
        return false;
      }
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * التحقق من حالة إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      if (Capacitor.isPluginAvailable('Camera')) {
        const status = await Camera.checkPermissions();
        return status.camera === 'granted';
      } else if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const status = await BarcodeScanner.checkPermissions();
        return status.camera === 'granted';
      }
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من إذن الكاميرا:', error);
      return false;
    }
  }
}

export const scannerPermissionService = ScannerPermissionService.getInstance();
