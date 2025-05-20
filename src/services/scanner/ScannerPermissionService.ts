
/**
 * خدمة إدارة أذونات الماسح الضوئي
 */
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';
import { platformService } from './PlatformService';

export class ScannerPermissionService {
  private permissionRequestCount = 0;
  
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    try {
      // التحقق أولاً إذا كنا في منصة أصلية
      if (!platformService.isNativePlatform()) {
        console.warn('[ScannerPermissionService] نحن في بيئة المتصفح، الماسح غير مدعوم');
        return false;
      }
      
      // طباعة معلومات عن المنصة وتوفر الملحقات
      console.log(`[ScannerPermissionService] منصة: ${platformService.getPlatform()}`);
      console.log(`[ScannerPermissionService] MLKitBarcodeScanner: ${platformService.isPluginAvailable('MLKitBarcodeScanner')}`);
      console.log(`[ScannerPermissionService] Camera: ${platformService.isPluginAvailable('Camera')}`);
      
      // التحقق من دعم ملحق الماسح الضوئي
      if (platformService.isPluginAvailable('MLKitBarcodeScanner')) {
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
      if (platformService.isNativePlatform()) {
        console.log('[ScannerPermissionService] في بيئة الجوال، نفترض دعم الكاميرا');
        return true;
      }

      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من الدعم:', error);
      // في حالة الخطأ في بيئة الجوال، نفترض وجود الدعم كإجراء احتياطي
      return platformService.isNativePlatform();
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
      
      // في بيئة التطبيق الأصلي
      if (platformService.isNativePlatform()) {
        // محاولة استخدام BarcodeScanner أولاً
        if (platformService.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('[ScannerPermissionService] التحقق من الإذن باستخدام MLKitBarcodeScanner');
          const status = await BarcodeScanner.checkPermissions();
          console.log('[ScannerPermissionService] حالة إذن MLKitBarcodeScanner:', status);
          
          // إظهار حالة الإذن للمستخدم
          await Toast.show({
            text: `حالة إذن الكاميرا: ${status.camera}`,
            duration: 'short'
          });
          
          return status.camera === 'granted';
        }
        
        // استخدام ملحق الكاميرا العادي
        if (platformService.isPluginAvailable('Camera')) {
          console.log('[ScannerPermissionService] التحقق من الإذن باستخدام Camera');
          const status = await Camera.checkPermissions();
          console.log('[ScannerPermissionService] حالة إذن Camera:', status);
          
          // إظهار حالة الإذن للمستخدم
          await Toast.show({
            text: `حالة إذن الكاميرا: ${status.camera}`,
            duration: 'short'
          });
          
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

      // زيادة عداد محاولات طلب الإذن
      this.permissionRequestCount++;
      console.log(`[ScannerPermissionService] محاولة طلب الإذن رقم: ${this.permissionRequestCount}`);
      
      // إظهار رسالة للمستخدم قبل طلب الإذن
      await Toast.show({
        text: 'التطبيق بحاجة إلى إذن الكاميرا لمسح الباركود',
        duration: 'long'
      });
      
      // في بيئة التطبيق الأصلي
      if (platformService.isNativePlatform()) {
        // محاولة استخدام BarcodeScanner أولاً
        if (platformService.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('[ScannerPermissionService] طلب الإذن باستخدام MLKitBarcodeScanner');
          
          try {
            const status = await BarcodeScanner.checkPermissions();
            
            if (status.camera === 'granted') {
              console.log('[ScannerPermissionService] الإذن ممنوح بالفعل');
              return true;
            }
            
            // طلب الإذن إذا لم يكن ممنوحاً
            console.log('[ScannerPermissionService] طلب الإذن من خلال MLKitBarcodeScanner.requestPermissions...');
            const result = await BarcodeScanner.requestPermissions();
            console.log('[ScannerPermissionService] نتيجة طلب الإذن:', result);
            
            if (result.camera === 'granted') {
              await Toast.show({
                text: 'تم منح إذن الكاميرا بنجاح',
                duration: 'short'
              });
              return true;
            } else if (result.camera === 'denied') {
              // فتح إعدادات التطبيق مباشرة بعد الرفض
              await Toast.show({
                text: 'تم رفض إذن الكاميرا. فتح الإعدادات...',
                duration: 'short'
              });
              await this.openAppSettings();
              return false;
            }
          } catch (error) {
            console.error('[ScannerPermissionService] خطأ في طلب الإذن باستخدام MLKitBarcodeScanner:', error);
          }
        }
        
        // استخدام ملحق الكاميرا العادي
        if (platformService.isPluginAvailable('Camera')) {
          console.log('[ScannerPermissionService] طلب الإذن باستخدام Camera');
          
          try {
            const status = await Camera.checkPermissions();
            
            if (status.camera === 'granted') {
              console.log('[ScannerPermissionService] الإذن ممنوح بالفعل');
              return true;
            }
            
            // طلب الإذن إذا لم يكن ممنوحاً
            console.log('[ScannerPermissionService] طلب الإذن من خلال Camera.requestPermissions...');
            const result = await Camera.requestPermissions();
            console.log('[ScannerPermissionService] نتيجة طلب الإذن:', result);
            
            if (result.camera === 'granted') {
              await Toast.show({
                text: 'تم منح إذن الكاميرا بنجاح',
                duration: 'short'
              });
              return true;
            } else if (result.camera === 'denied') {
              // فتح إعدادات التطبيق مباشرة بعد الرفض
              await Toast.show({
                text: 'تم رفض إذن الكاميرا. فتح الإعدادات...',
                duration: 'short'
              });
              await this.openAppSettings();
              return false;
            }
          } catch (error) {
            console.error('[ScannerPermissionService] خطأ في طلب الإذن باستخدام Camera:', error);
          }
        }
        
        // إذا وصلنا هنا ولم ننجح، نحاول فتح إعدادات التطبيق
        await Toast.show({
          text: 'لم نستطع الحصول على إذن الكاميرا. سنفتح إعدادات التطبيق',
          duration: 'short'
        });
        await this.openAppSettings();
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
      
      if (platformService.isNativePlatform()) {
        const platform = platformService.getPlatform();
        const appId = await platformService.getAppId();
        
        // إعداد مسار URL حسب المنصة
        let settingsUrl = '';
        if (platform === 'android') {
          console.log('[ScannerPermissionService] فتح إعدادات أندرويد...');
          
          // محاولة فتح صفحة إعدادات التطبيق مباشرة
          try {
            // تجربة عدة صيغ من URL
            settingsUrl = `package:${appId}`;
            await App.openUrl({ url: settingsUrl });
            console.log(`[ScannerPermissionService] تم فتح URL: ${settingsUrl}`);
            return true;
          } catch (e) {
            console.error('[ScannerPermissionService] فشل في فتح App.openUrl:', e);
            
            // نجرب باستخدام Browser API
            try {
              console.log('[ScannerPermissionService] نجرب استخدام Browser API...');
              await Browser.open({ url: settingsUrl });
              return true;
            } catch (browserError) {
              console.error('[ScannerPermissionService] فشل في فتح Browser.open:', browserError);
              
              // كإجراء أخير، نعرض رسالة للمستخدم
              await Toast.show({
                text: 'يرجى فتح إعدادات التطبيق يدوياً وتمكين أذونات الكاميرا',
                duration: 'long'
              });
            }
          }
        } else if (platform === 'ios') {
          console.log('[ScannerPermissionService] فتح إعدادات iOS...');
          
          try {
            // على iOS نستخدم URL خاص
            await App.openUrl({ url: 'app-settings:' });
            console.log('[ScannerPermissionService] تم فتح إعدادات التطبيق');
            return true;
          } catch (e) {
            console.error('[ScannerPermissionService] فشل في فتح إعدادات iOS:', e);
            
            // نجرب باستخدام Browser API
            try {
              await Browser.open({ url: 'app-settings:' });
              return true;
            } catch (browserError) {
              console.error('[ScannerPermissionService] فشل في فتح Browser.open على iOS:', browserError);
            }
          }
        }
      } else {
        console.log('[ScannerPermissionService] لسنا في بيئة الجوال، لا يمكن فتح الإعدادات');
        
        // نعرض رسالة للمستخدم
        await Toast.show({
          text: 'غير متاح في بيئة المتصفح',
          duration: 'short'
        });
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
