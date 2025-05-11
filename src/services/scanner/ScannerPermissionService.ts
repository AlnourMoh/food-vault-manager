
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { Toast } from '@capacitor/toast';
import { AppSettingsOpener } from './permission/AppSettingsOpener';

/**
 * خدمة إدارة أذونات الماسح الضوئي
 */
export class ScannerPermissionService {
  private static instance: ScannerPermissionService;
  private permissionRequestCount: number = 0;

  private constructor() {
    console.log('[ScannerPermissionService] تهيئة خدمة الأذونات');
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
   * التحقق من دعم الماسح الضوئي على الجهاز
   */
  public async isSupported(): Promise<boolean> {
    // في بيئة الويب، نفترض أن الكاميرا مدعومة
    if (!Capacitor.isNativePlatform()) {
      return true;
    }
    
    // التحقق من توفر الملحق
    return Capacitor.isPluginAvailable('MLKitBarcodeScanner');
  }
  
  /**
   * التحقق من وجود إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] التحقق من إذن الكاميرا');
      
      // في بيئة الويب، نتحقق عبر واجهة المتصفح
      if (!Capacitor.isNativePlatform()) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.warn('[ScannerPermissionService] واجهة getUserMedia غير متاحة في المتصفح');
          return false;
        }
        
        try {
          // محاولة الوصول إلى الكاميرا للتحقق من الإذن
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // إغلاق مسارات الكاميرا فوراً
          stream.getTracks().forEach(track => track.stop());
          return true;
        } catch (error) {
          console.log('[ScannerPermissionService] تم رفض الوصول إلى الكاميرا في المتصفح');
          return false;
        }
      }
      
      // التحقق من إذن الكاميرا باستخدام MLKitBarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const { camera } = await BarcodeScanner.checkPermissions();
        return camera === 'granted';
      }
      
      // استخدام ملحق الكاميرا كخيار احتياطي
      if (Capacitor.isPluginAvailable('Camera')) {
        const { camera } = await Camera.checkPermissions();
        return camera === 'granted';
      }
      
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
      console.log('[ScannerPermissionService] طلب إذن الكاميرا');
      this.permissionRequestCount++;
      
      // في بيئة الويب، نستخدم واجهة المتصفح
      if (!Capacitor.isNativePlatform()) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.warn('[ScannerPermissionService] واجهة getUserMedia غير متاحة');
          return false;
        }
        
        try {
          await Toast.show({
            text: 'يرجى السماح للتطبيق باستخدام الكاميرا',
            duration: 'short'
          });
          
          // طلب الوصول إلى الكاميرا
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // إغلاق مسارات الكاميرا فوراً
          stream.getTracks().forEach(track => track.stop());
          return true;
        } catch (error) {
          console.log('[ScannerPermissionService] تم رفض الوصول إلى الكاميرا');
          return false;
        }
      }
      
      // طلب الإذن باستخدام MLKitBarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const { camera } = await BarcodeScanner.requestPermissions();
        const granted = camera === 'granted';
        
        // إذا وصلنا لأكثر من محاولتين ورفض المستخدم، نفتح الإعدادات
        if (!granted && this.permissionRequestCount >= 2) {
          await Toast.show({
            text: 'يجب تفعيل إذن الكاميرا من إعدادات التطبيق',
            duration: 'long'
          });
          
          // توجيه المستخدم إلى إعدادات التطبيق
          setTimeout(() => {
            this.openAppSettings();
          }, 1000);
        }
        
        return granted;
      }
      
      // استخدام ملحق الكاميرا كخيار احتياطي
      if (Capacitor.isPluginAvailable('Camera')) {
        const { camera } = await Camera.requestPermissions();
        return camera === 'granted';
      }
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * فتح إعدادات التطبيق
   */
  public async openAppSettings(): Promise<boolean> {
    return await AppSettingsOpener.openAppSettings();
  }
}

// تصدير مثيل الخدمة
export const scannerPermissionService = ScannerPermissionService.getInstance();
