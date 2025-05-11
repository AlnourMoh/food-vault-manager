
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
  private lastPermissionRequest: number = 0;

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
      
      // التحقق من إذن الكاميرا باستخدام MLKitBarcodeScanner أولاً
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          console.log('[ScannerPermissionService] فحص أذونات BarcodeScanner');
          const { camera } = await BarcodeScanner.checkPermissions();
          const isGranted = camera === 'granted';
          console.log('[ScannerPermissionService] نتيجة فحص MLKit:', isGranted ? 'ممنوح' : 'غير ممنوح');
          
          // محاولة التحقق من أذونات الكاميرا إذا لم يكن الإذن ممنوحًا
          if (!isGranted && Capacitor.isPluginAvailable('Camera')) {
            console.log('[ScannerPermissionService] محاولة التحقق باستخدام ملحق Camera');
            const camResult = await Camera.checkPermissions();
            const camGranted = camResult.camera === 'granted';
            console.log('[ScannerPermissionService] نتيجة فحص Camera:', camGranted ? 'ممنوح' : 'غير ممنوح');
            return camGranted;
          }
          
          return isGranted;
        } catch (error) {
          console.error('[ScannerPermissionService] خطأ في التحقق من أذونات MLKit:', error);
          // استمرار للخيار البديل
        }
      }
      
      // استخدام ملحق الكاميرا كخيار احتياطي
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('[ScannerPermissionService] استخدام ملحق Camera للتحقق من الإذن');
        const { camera } = await Camera.checkPermissions();
        const isGranted = camera === 'granted';
        console.log('[ScannerPermissionService] نتيجة فحص Camera:', isGranted ? 'ممنوح' : 'غير ممنوح');
        return isGranted;
      }
      
      console.warn('[ScannerPermissionService] لا توجد ملحقات متاحة للتحقق من إذن الكاميرا');
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
      this.lastPermissionRequest = Date.now();
      
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
      
      // طلب الإذن باستخدام MLKitBarcodeScanner أولاً
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          console.log('[ScannerPermissionService] طلب إذن الكاميرا باستخدام BarcodeScanner');
          
          // عرض رسالة قبل طلب الإذن
          await Toast.show({
            text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
            duration: 'short'
          });
          
          const { camera } = await BarcodeScanner.requestPermissions();
          const granted = camera === 'granted';
          console.log('[ScannerPermissionService] نتيجة طلب أذونات MLKit:', granted ? 'ممنوح' : 'مرفوض');
          
          // إذا تم منح الإذن، نعود مباشرة
          if (granted) {
            return true;
          }
          
          // إذا وصلنا لأكثر من محاولتين ورفض المستخدم، نفتح الإعدادات
          if (this.permissionRequestCount >= 2) {
            console.log('[ScannerPermissionService] تم رفض الإذن مرتين، توجيه المستخدم إلى الإعدادات');
            
            await Toast.show({
              text: 'يجب تفعيل إذن الكاميرا من إعدادات التطبيق',
              duration: 'long'
            });
            
            // توجيه المستخدم إلى إعدادات التطبيق
            setTimeout(async () => {
              await this.openAppSettings();
            }, 1000);
            
            return false;
          }
          
          // محاولة طلب الإذن باستخدام ملحق الكاميرا كخيار بديل
          console.log('[ScannerPermissionService] محاولة طلب الإذن باستخدام ملحق الكاميرا');
          return await this.requestCameraPermission();
        } catch (error) {
          console.error('[ScannerPermissionService] خطأ في طلب إذن MLKit:', error);
          // استمرار للخيار البديل
        }
      }
      
      // استخدام ملحق الكاميرا كخيار احتياطي
      return await this.requestCameraPermission();
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا باستخدام ملحق Camera
   */
  private async requestCameraPermission(): Promise<boolean> {
    if (!Capacitor.isPluginAvailable('Camera')) {
      console.warn('[ScannerPermissionService] ملحق Camera غير متاح');
      return false;
    }
    
    try {
      console.log('[ScannerPermissionService] طلب إذن الكاميرا باستخدام ملحق Camera');
      
      const { camera } = await Camera.requestPermissions();
      const granted = camera === 'granted';
      
      console.log('[ScannerPermissionService] نتيجة طلب أذونات Camera:', granted ? 'ممنوح' : 'مرفوض');
      
      // إذا رفض المستخدم وهذه المحاولة الثانية أو أكثر، نفتح الإعدادات
      if (!granted && this.permissionRequestCount >= 2) {
        console.log('[ScannerPermissionService] تم رفض إذن الكاميرا مرتين، توجيه المستخدم إلى الإعدادات');
        
        await Toast.show({
          text: 'يجب تفعيل إذن الكاميرا من إعدادات التطبيق',
          duration: 'long'
        });
        
        // توجيه المستخدم إلى إعدادات التطبيق
        setTimeout(async () => {
          await this.openAppSettings();
        }, 1000);
      }
      
      return granted;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في طلب إذن Camera:', error);
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
