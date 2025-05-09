
/**
 * خدمة إدارة أذونات الماسح الضوئي
 */
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { AppSettingsOpener } from './permission/AppSettingsOpener';

export class ScannerPermissionService {
  // عدد مرات محاولة طلب الإذن
  private permissionAttempts = 0;
  
  /**
   * فحص وجود إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: فحص إذن الكاميرا');
      
      if (Capacitor.isNativePlatform()) {
        // التحقق من توفر مكتبة MLKit أولاً
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('استخدام MLKitBarcodeScanner لفحص الإذن');
          const { camera } = await BarcodeScanner.checkPermissions();
          return camera === 'granted';
        } 
        
        // استخدام ملحق الكاميرا كبديل
        if (Capacitor.isPluginAvailable('Camera')) {
          console.log('استخدام Camera لفحص الإذن');
          const { camera } = await Camera.checkPermissions();
          return camera === 'granted';
        }
        
        // في حالة عدم توفر أي من المكتبات
        console.warn('لا يوجد ملحق متاح لفحص إذن الكاميرا');
        return false;
      } 
      
      // في بيئة الويب نتحقق من وجود الإذن من المتصفح
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        try {
          // نحاول الوصول إلى الكاميرا
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // إغلاق المسار فوراً لأننا نحتاج فقط التحقق من الإذن
          stream.getTracks().forEach(track => track.stop());
          return true;
        } catch (error) {
          console.log('تم رفض إذن كاميرا المتصفح أو غير متاح:', error);
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في فحص الإذن:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: طلب إذن الكاميرا');
      this.permissionAttempts++;
      
      // التحقق من العدد الأقصى من المحاولات لتجنب طلبات متكررة مزعجة
      if (this.permissionAttempts > 2) {
        console.log('ScannerPermissionService: تم تجاوز الحد الأقصى من محاولات طلب الإذن');
        // محاولة فتح إعدادات التطبيق للحصول على الإذن يدوياً
        return await AppSettingsOpener.openAppSettings();
      }
      
      // في حالة وجود الإذن بالفعل
      const hasPermission = await this.checkPermission();
      if (hasPermission) {
        console.log('ScannerPermissionService: الإذن ممنوح بالفعل');
        return true;
      }
      
      if (Capacitor.isNativePlatform()) {
        // التحقق من توفر مكتبة MLKit أولاً
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('استخدام MLKitBarcodeScanner لطلب الإذن');
          const { camera } = await BarcodeScanner.requestPermissions();
          return camera === 'granted';
        } 
        
        // استخدام ملحق الكاميرا كبديل
        if (Capacitor.isPluginAvailable('Camera')) {
          console.log('استخدام Camera لطلب الإذن');
          const { camera } = await Camera.requestPermissions();
          return camera === 'granted';
        }
        
        // في حالة عدم توفر أي من المكتبات، نفتح الإعدادات
        console.warn('لا يوجد ملحق متاح لطلب إذن الكاميرا، محاولة فتح الإعدادات');
        return await AppSettingsOpener.openAppSettings();
      } 
      
      // في بيئة الويب نطلب الإذن من المتصفح
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        try {
          // نحاول الوصول إلى الكاميرا
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // إغلاق المسار فوراً لأننا نحتاج فقط التحقق من الإذن
          stream.getTracks().forEach(track => track.stop());
          return true;
        } catch (error) {
          console.log('تم رفض إذن كاميرا المتصفح:', error);
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في طلب الإذن:', error);
      return false;
    }
  }
  
  /**
   * فتح إعدادات التطبيق لتمكين الإذن
   */
  public async openAppSettings(): Promise<boolean> {
    return await AppSettingsOpener.openAppSettings();
  }
  
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    try {
      // التحقق من دعم getUserMedia
      if (Capacitor.isNativePlatform()) {
        // على الأجهزة الجوالة نتحقق من دعم المكتبات
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          const supported = await BarcodeScanner.isSupported();
          return supported.supported;
        }
        
        // نفترض الدعم إذا كان ملحق الكاميرا متاحاً
        return Capacitor.isPluginAvailable('Camera');
      }
      
      // التحقق من دعم getUserMedia في المتصفح
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
}

// إنشاء نسخة مفردة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerPermissionService = new ScannerPermissionService();
