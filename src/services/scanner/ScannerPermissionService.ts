
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

/**
 * خدمة للتحكم في أذونات الكاميرا والماسح الضوئي
 */
class ScannerPermissionService {
  private static instance: ScannerPermissionService;
  private permissionRequestCount = 0;
  
  private constructor() {
    console.log('[ScannerPermissionService] تم إنشاء خدمة الأذونات');
  }
  
  public static getInstance(): ScannerPermissionService {
    if (!ScannerPermissionService.instance) {
      ScannerPermissionService.instance = new ScannerPermissionService();
    }
    return ScannerPermissionService.instance;
  }
  
  /**
   * التحقق مما إذا كانت الكاميرا مدعومة
   */
  public async isSupported(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] التحقق من دعم الماسح...');
      
      // في بيئة المتصفح، نتحقق من واجهة mediaDevices
      if (!Capacitor.isNativePlatform()) {
        const hasMediaDevices = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
        console.log(`[ScannerPermissionService] دعم mediaDevices في المتصفح: ${hasMediaDevices}`);
        return hasMediaDevices;
      }
      
      // التحقق من توفر الملحق في التطبيق الأصلي
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerPermissionService] ملحق MLKit متاح، التحقق من الدعم');
        const result = await BarcodeScanner.isSupported();
        console.log('[ScannerPermissionService] نتيجة فحص دعم MLKit:', result);
        return result.supported;
      }
      
      // بدائل في حالة عدم دعم MLKit
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('[ScannerPermissionService] ملحق Camera متاح، نفترض أن الماسح مدعوم');
        return true;
      }
      
      // لا يوجد دعم للكاميرا
      console.log('[ScannerPermissionService] لا يوجد دعم للكاميرا أو الماسح الضوئي');
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من الدعم:', error);
      return false;
    }
  }
  
  /**
   * التحقق من حالة إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] التحقق من إذن الكاميرا...');
      
      // في بيئة المتصفح، محاولة الوصول إلى الكاميرا لفحص الإذن
      if (!Capacitor.isNativePlatform()) {
        try {
          if (!('mediaDevices' in navigator) || !('getUserMedia' in navigator.mediaDevices)) {
            console.log('[ScannerPermissionService] المتصفح لا يدعم واجهة mediaDevices');
            return false;
          }
          
          // محاولة سريعة للوصول إلى الكاميرا
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          
          // إغلاق الدفق فورًا بعد التحقق من الإذن
          stream.getTracks().forEach(track => track.stop());
          
          console.log('[ScannerPermissionService] تم منح إذن كاميرا المتصفح');
          return true;
        } catch (error) {
          console.error('[ScannerPermissionService] تم رفض إذن كاميرا المتصفح:', error);
          return false;
        }
      }
      
      // استخدام الملحق المناسب للتحقق من الإذن
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerPermissionService] فحص إذن MLKit');
        const status = await BarcodeScanner.checkPermissions();
        const granted = status.camera === 'granted';
        console.log(`[ScannerPermissionService] حالة إذن MLKit: ${granted ? 'ممنوح' : 'غير ممنوح'}`);
        return granted;
      } else if (Capacitor.isPluginAvailable('Camera')) {
        console.log('[ScannerPermissionService] فحص إذن Camera');
        const status = await Camera.checkPermissions();
        const granted = status.camera === 'granted';
        console.log(`[ScannerPermissionService] حالة إذن Camera: ${granted ? 'ممنوح' : 'غير ممنوح'}`);
        return granted;
      }
      
      // لا يوجد ملحق متاح لفحص الإذن
      console.warn('[ScannerPermissionService] لا يوجد ملحق متاح لفحص الإذن');
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من الإذن:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      this.permissionRequestCount++;
      console.log(`[ScannerPermissionService] طلب إذن الكاميرا (محاولة ${this.permissionRequestCount})...`);
      
      // عرض رسالة توضيحية للمستخدم
      await Toast.show({
        text: 'المسح الضوئي يتطلب إذن الكاميرا',
        duration: 'short'
      });
      
      // في بيئة المتصفح
      if (!Capacitor.isNativePlatform()) {
        try {
          if (!('mediaDevices' in navigator) || !('getUserMedia' in navigator.mediaDevices)) {
            console.log('[ScannerPermissionService] المتصفح لا يدعم واجهة mediaDevices');
            return false;
          }
          
          // طلب الوصول إلى الكاميرا
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          
          // إغلاق الدفق فورًا بعد طلب الإذن
          stream.getTracks().forEach(track => track.stop());
          
          console.log('[ScannerPermissionService] تم منح إذن كاميرا المتصفح');
          return true;
        } catch (error) {
          console.error('[ScannerPermissionService] تم رفض إذن كاميرا المتصفح:', error);
          return false;
        }
      }
      
      // باستخدام MLKit
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerPermissionService] طلب إذن MLKit');
        const status = await BarcodeScanner.requestPermissions();
        const granted = status.camera === 'granted';
        console.log(`[ScannerPermissionService] نتيجة طلب إذن MLKit: ${granted ? 'ممنوح' : 'غير ممنوح'}`);
        
        if (granted) {
          return true;
        }
      }
      
      // يمكن أن نجرب أيضًا باستخدام ملحق Camera
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('[ScannerPermissionService] طلب إذن Camera');
        const status = await Camera.requestPermissions({
          permissions: ['camera']
        });
        const granted = status.camera === 'granted';
        console.log(`[ScannerPermissionService] نتيجة طلب إذن Camera: ${granted ? 'ممنوح' : 'غير ممنوح'}`);
        
        if (granted) {
          return true;
        }
      }
      
      // إذا وصلنا لهنا فلم يتم منح الإذن
      console.warn('[ScannerPermissionService] تم رفض جميع محاولات طلب الإذن');
      
      // إذا تعددت المحاولات، نقترح على المستخدم فتح الإعدادات
      if (this.permissionRequestCount >= 2) {
        await Toast.show({
          text: 'يرجى تمكين إذن الكاميرا من إعدادات التطبيق',
          duration: 'long'
        });
        
        setTimeout(() => this.openAppSettings(), 1500);
      }
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في طلب الإذن:', error);
      return false;
    }
  }
  
  /**
   * فتح إعدادات التطبيق لتمكين المستخدم من منح الإذن
   */
  public async openAppSettings(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] محاولة فتح إعدادات التطبيق');
      
      // عرض رسالة للمستخدم
      await Toast.show({
        text: 'يرجى تمكين إذن الكاميرا من إعدادات التطبيق',
        duration: 'long'
      });
      
      // التحقق من توفر الملحق المطلوب
      if (!Capacitor.isPluginAvailable('App')) {
        console.warn('[ScannerPermissionService] ملحق App غير متاح، لا يمكن فتح الإعدادات');
        return false;
      }
      
      // فتح إعدادات التطبيق - تصحيح استخدام App.openSettings
      if (App && typeof App.openSettings === 'function') {
        await App.openSettings();
        console.log('[ScannerPermissionService] تم فتح إعدادات التطبيق');
        return true;
      } else {
        console.error('[ScannerPermissionService] App.openSettings غير متوفر');
        return false;
      }
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في فتح إعدادات التطبيق:', error);
      return false;
    }
  }
  
  /**
   * إعادة تعيين عداد محاولات طلب الإذن
   */
  public resetPermissionRequestCount(): void {
    this.permissionRequestCount = 0;
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerPermissionService = ScannerPermissionService.getInstance();
