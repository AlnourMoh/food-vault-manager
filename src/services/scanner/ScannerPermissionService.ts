
/**
 * خدمة إدارة أذونات الماسح الضوئي
 */
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { App } from '@capacitor/app';

export class ScannerPermissionService {
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    try {
      // التحقق أولاً إذا كنا في منصة أصلية
      if (!Capacitor.isNativePlatform()) {
        console.warn('[ScannerPermissionService] نحن في بيئة المتصفح، الماسح غير مدعوم');
        return false;
      }
      
      // التحقق من دعم ملحق الماسح الضوئي
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const result = await BarcodeScanner.isSupported();
        return result.supported;
      }

      // التحقق من دعم getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('[ScannerPermissionService] getUserMedia غير مدعوم في هذا المتصفح');
        return false;
      }

      // التحقق من دعم مدخلات الفيديو
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoInput = devices.some(device => device.kind === 'videoinput');
      
      if (!hasVideoInput) {
        console.warn('[ScannerPermissionService] لا توجد كاميرات متاحة على هذا الجهاز');
        return false;
      }

      return true;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من الدعم:', error);
      return false;
    }
  }

  /**
   * التحقق من إذن الكاميرا دون طلب الإذن
   */
  public async checkPermission(): Promise<boolean> {
    try {
      if (!await this.isSupported()) {
        console.warn('[ScannerPermissionService] الجهاز لا يدعم المسح الضوئي');
        return false;
      }
      
      // في بيئة التطبيق الأصلي
      if (Capacitor.isNativePlatform()) {
        // محاولة استخدام BarcodeScanner أولاً
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('[ScannerPermissionService] التحقق من الإذن باستخدام MLKitBarcodeScanner');
          const status = await BarcodeScanner.checkPermissions();
          return status.camera === 'granted';
        }
        
        // استخدام ملحق الكاميرا العادي
        if (Capacitor.isPluginAvailable('Camera')) {
          console.log('[ScannerPermissionService] التحقق من الإذن باستخدام Camera');
          const status = await Camera.checkPermissions();
          return status.camera === 'granted';
        }
      }
      
      // في بيئة المتصفح، نتحقق من إمكانية الوصول إلى الكاميرا
      // ولكن لا نحاول الوصول إليها فعليًا لتجنب ظهور النافذة المنبثقة للإذن
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        // إذا كانت هناك أجهزة فيديو، فهناك احتمال أن يكون لدينا إذن أو لم يتم طلبه بعد
        // لا يمكننا معرفة حالة الإذن بدقة بدون محاولة الوصول للكاميرا
        return videoDevices.length > 0;
      } catch (error) {
        console.error('[ScannerPermissionService] خطأ في التحقق من أجهزة الفيديو:', error);
        return false;
      }
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
      if (!await this.isSupported()) {
        console.warn('[ScannerPermissionService] الجهاز لا يدعم المسح الضوئي');
        return false;
      }
      
      // في بيئة التطبيق الأصلي
      if (Capacitor.isNativePlatform()) {
        // محاولة استخدام BarcodeScanner أولاً
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('[ScannerPermissionService] طلب الإذن باستخدام MLKitBarcodeScanner');
          const status = await BarcodeScanner.checkPermissions();
          
          if (status.camera === 'granted') {
            return true;
          }
          
          // طلب الإذن إذا لم يكن ممنوحاً
          const result = await BarcodeScanner.requestPermissions();
          return result.camera === 'granted';
        }
        
        // استخدام ملحق الكاميرا العادي
        if (Capacitor.isPluginAvailable('Camera')) {
          console.log('[ScannerPermissionService] طلب الإذن باستخدام Camera');
          const status = await Camera.checkPermissions();
          
          if (status.camera === 'granted') {
            return true;
          }
          
          // طلب الإذن إذا لم يكن ممنوحاً
          const result = await Camera.requestPermissions();
          return result.camera === 'granted';
        }
      }
      
      // في بيئة المتصفح - محاولة الوصول إلى الكاميرا
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        // إغلاق المسار فوراً لأننا نحتاج فقط التحقق من الإذن
        stream.getTracks().forEach(track => track.stop());
        
        console.log('[ScannerPermissionService] تم الحصول على إذن الكاميرا بنجاح');
        
        return true;
      } catch (error) {
        console.error('[ScannerPermissionService] خطأ في طلب إذن الكاميرا:', error);
        return false;
      }
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * فتح إعدادات التطبيق
   */
  public async openAppSettings(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        // محاولة استخدام واجهة برمجة التطبيق لفتح الإعدادات
        if (Capacitor.isPluginAvailable('App')) {
          // استخدام طريقة آمنة للوصول للإعدادات
          const appInfo = await App.getInfo();
          
          // تحديد عنوان URL حسب المنصة
          let settingsUrl = '';
          if (Capacitor.getPlatform() === 'ios') {
            settingsUrl = 'app-settings:';
          } else if (Capacitor.getPlatform() === 'android') {
            settingsUrl = 'package:' + appInfo.id;
          } else {
            return false;
          }
          
          // استخدام الطريقة المناسبة للفتح
          if (typeof App.openUrl === 'function') {
            await App.openUrl({ url: settingsUrl });
            return true;
          } else {
            console.warn('[ScannerPermissionService] وظيفة App.openUrl غير متاحة');
            return false;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في فتح إعدادات التطبيق:', error);
      return false;
    }
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerPermissionService = new ScannerPermissionService();
