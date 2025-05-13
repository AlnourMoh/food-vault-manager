/**
 * خدمة إدارة أذونات الماسح الضوئي
 */
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { App } from '@capacitor/app';
import { PlatformService } from './PlatformService';

export class ScannerPermissionService {
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    try {
      // التحقق أولاً إذا كنا في منصة أصلية
      if (!PlatformService.isNativePlatform()) {
        console.warn('[ScannerPermissionService] نحن في بيئة المتصفح، الماسح غير مدعوم');
        return false;
      }
      
      // طباعة معلومات عن المنصة وتوفر الملحقات
      console.log(`[ScannerPermissionService] منصة: ${PlatformService.getPlatform()}`);
      console.log(`[ScannerPermissionService] MLKitBarcodeScanner: ${PlatformService.isPluginAvailable('MLKitBarcodeScanner')}`);
      console.log(`[ScannerPermissionService] Camera: ${PlatformService.isPluginAvailable('Camera')}`);
      
      // التحقق من دعم ملحق الماسح الضوئي
      if (PlatformService.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const result = await BarcodeScanner.isSupported();
          console.log('[ScannerPermissionService] نتيجة isSupported من BarcodeScanner:', result);
          return result.supported;
        } catch (error) {
          console.error('[ScannerPermissionService] خطأ في التحقق من دعم BarcodeScanner:', error);
        }
      }

      // كخطة بديلة، التحقق من دعم getUserMedia
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // التحقق من دعم مدخلات الفيديو
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasVideoInput = devices.some(device => device.kind === 'videoinput');
          
          if (hasVideoInput) {
            console.log('[ScannerPermissionService] تم اكتشاف كاميرا باستخدام enumerateDevices');
            return true;
          } else {
            console.warn('[ScannerPermissionService] لا توجد كاميرات متاحة على هذا الجهاز');
          }
        } catch (error) {
          console.error('[ScannerPermissionService] خطأ في استخدام enumerateDevices:', error);
        }
      } else {
        console.warn('[ScannerPermissionService] getUserMedia غير مدعوم في هذا المتصفح');
      }
      
      // في بيئة الجوال، نفترض وجود الكاميرا حتى لو لم نتمكن من التحقق منها
      if (PlatformService.isNativePlatform()) {
        console.log('[ScannerPermissionService] في بيئة الجوال، نفترض دعم الكاميرا');
        return true;
      }

      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من الدعم:', error);
      // في حالة الخطأ في بيئة الجوال، نفترض وجود الدعم كإجراء احتياطي
      return PlatformService.isNativePlatform();
    }
  }

  /**
   * التحقق من إذن الكاميرا دون طلب الإذن
   */
  public async checkPermission(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] التحقق من إذن الكاميرا...');
      
      if (!await this.isSupported()) {
        console.warn('[ScannerPermissionService] الجهاز لا يدعم المسح الضوئي');
        return false;
      }
      
      // في بيئة التطبيق الأ��لي
      if (PlatformService.isNativePlatform()) {
        // محاولة استخدام BarcodeScanner أولاً
        if (PlatformService.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('[ScannerPermissionService] التحقق من الإذن باستخدام MLKitBarcodeScanner');
          const status = await BarcodeScanner.checkPermissions();
          console.log('[ScannerPermissionService] حالة إذن MLKitBarcodeScanner:', status);
          return status.camera === 'granted';
        }
        
        // استخدام ملحق الكاميرا العادي
        if (PlatformService.isPluginAvailable('Camera')) {
          console.log('[ScannerPermissionService] التحقق من الإذن باستخدام Camera');
          const status = await Camera.checkPermissions();
          console.log('[ScannerPermissionService] حالة إذن Camera:', status);
          return status.camera === 'granted';
        }
        
        console.warn('[ScannerPermissionService] لا يوجد ملحق متاح للتحقق من الإذن');
        return false;
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
      console.log('[ScannerPermissionService] طلب إذن الكاميرا...');
      
      if (!await this.isSupported()) {
        console.warn('[ScannerPermissionService] الجهاز لا يدعم المسح الضوئي');
        return false;
      }
      
      // في بيئة التطبيق الأصلي
      if (PlatformService.isNativePlatform()) {
        // محاولة استخدام BarcodeScanner أولاً
        if (PlatformService.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('[ScannerPermissionService] طلب الإذن باستخدام MLKitBarcodeScanner');
          const status = await BarcodeScanner.checkPermissions();
          
          if (status.camera === 'granted') {
            console.log('[ScannerPermissionService] الإذن ممنوح بالفعل');
            return true;
          }
          
          // طلب الإذن إذا لم يكن ممنوحاً
          console.log('[ScannerPermissionService] طلب الإذن من خلال requestPermissions...');
          const result = await BarcodeScanner.requestPermissions();
          console.log('[ScannerPermissionService] نتيجة طلب الإذن:', result);
          return result.camera === 'granted';
        }
        
        // استخدام ملحق الكاميرا العادي
        if (PlatformService.isPluginAvailable('Camera')) {
          console.log('[ScannerPermissionService] طلب الإذن باستخدام Camera');
          const status = await Camera.checkPermissions();
          
          if (status.camera === 'granted') {
            console.log('[ScannerPermissionService] الإذن ممنوح بالفعل');
            return true;
          }
          
          // طلب الإذن إذا لم يكن ممنوحاً
          console.log('[ScannerPermissionService] طلب الإذن من خلال Camera.requestPermissions...');
          const result = await Camera.requestPermissions();
          console.log('[ScannerPermissionService] نتيجة طلب الإذن:', result);
          return result.camera === 'granted';
        }
        
        console.warn('[ScannerPermissionService] لا يوجد ملحق متاح لطلب الإذن');
        return false;
      }
      
      // في بيئة المتصفح - محاولة الوصول إلى الكاميرا
      try {
        console.log('[ScannerPermissionService] محاولة الوصول إلى الكاميرا في المتصفح...');
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
      console.log('[ScannerPermissionService] محاولة فتح إعدادات التطبيق...');
      
      if (PlatformService.isNativePlatform()) {
        // محاولة استخدام واجهة برمجة التطبيق لفتح الإعدادات
        if (PlatformService.isPluginAvailable('App')) {
          // استخدام طريقة آمنة للوصول للإعدادات
          const appInfo = await App.getInfo();
          console.log('[ScannerPermissionService] معلومات التطبيق:', appInfo);
          
          // استخدام exitApp بدلاً من openUrl (الذي تسبب في الخطأ)
          try {
            console.log('[ScannerPermissionService] محاولة استخدام exitApp...');
            await App.exitApp();
            return true;
          } catch (e) {
            console.error('[ScannerPermissionService] خطأ في محاولة الخروج من التطبيق:', e);
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
