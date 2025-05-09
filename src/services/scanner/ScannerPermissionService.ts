
/**
 * خدمة إدارة أذونات الماسح الضوئي
 */
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { AppSettingsOpener } from './permission/AppSettingsOpener';
import { Toast } from '@capacitor/toast';

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
          
          try {
            const status = await BarcodeScanner.checkPermissions();
            console.log('نتيجة فحص أذونات MLKit:', status);
            return status.camera === 'granted';
          } catch (mlkitError) {
            console.error('خطأ في فحص أذونات MLKit:', mlkitError);
            // استمرار للطريقة التالية
          }
        } 
        
        // استخدام ملحق الكاميرا كبديل
        if (Capacitor.isPluginAvailable('Camera')) {
          console.log('استخدام Camera لفحص الإذن');
          try {
            const status = await Camera.checkPermissions();
            console.log('نتيجة فحص أذونات الكاميرا:', status);
            return status.camera === 'granted';
          } catch (cameraError) {
            console.error('خطأ في فحص أذونات الكاميرا:', cameraError);
          }
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
          console.log('تم منح إذن كاميرا المتصفح بنجاح');
          return true;
        } catch (error) {
          console.log('تم رفض إذن كاميرا المتصفح أو غير متاح:', error);
          return false;
        }
      }
      
      console.log('لا يدعم المتصفح getUserMedia، لا يمكن استخدام الكاميرا');
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
        await Toast.show({
          text: 'سيتم توجيهك إلى إعدادات التطبيق لتمكين إذن الكاميرا يدوياً',
          duration: 'short'
        });
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
          console.log('استخدام Camera لطلب الإذن');
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
        console.warn('لا يوجد ملحق متاح لطلب إذن الكاميرا، محاولة فتح الإعدادات');
        return await AppSettingsOpener.openAppSettings();
      } 
      
      // في بيئة الويب نطلب الإذن من المتصفح
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
          console.log('تم منح إذن كاميرا المتصفح بنجاح');
          return true;
        } catch (error) {
          console.log('تم رفض إذن كاميرا المتصفح:', error);
          return false;
        }
      }
      
      console.log('لا يدعم المتصفح getUserMedia، لا يمكن استخدام الكاميرا');
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
    console.log('ScannerPermissionService: فتح إعدادات التطبيق');
    // عرض إشعار للمستخدم
    await Toast.show({
      text: 'يرجى تمكين إذن الكاميرا من إعدادات التطبيق',
      duration: 'short'
    });
    
    return await AppSettingsOpener.openAppSettings();
  }
  
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: التحقق من دعم الماسح الضوئي');
      
      // التحقق من دعم getUserMedia
      if (Capacitor.isNativePlatform()) {
        // على الأجهزة الجوالة نتحقق من دعم المكتبات
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          try {
            const supported = await BarcodeScanner.isSupported();
            console.log('هل MLKit مدعوم؟', supported);
            return supported.supported;
          } catch (error) {
            console.error('خطأ في التحقق من دعم MLKit:', error);
          }
        }
        
        // نفترض الدعم إذا كان ملحق الكاميرا متاحاً
        const hasCameraSupport = Capacitor.isPluginAvailable('Camera');
        console.log('هل ملحق الكاميرا متاح؟', hasCameraSupport);
        return hasCameraSupport;
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

      console.log('[ScannerPermissionService] الكاميرا مدعومة على هذا الجهاز');
      return true;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من الدعم:', error);
      return false;
    }
  }
}

// إنشاء نسخة مفردة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerPermissionService = new ScannerPermissionService();
