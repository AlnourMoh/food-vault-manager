
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { App } from '@capacitor/app';

/**
 * خدمة مسؤولة عن إدارة أذونات الماسح الضوئي
 */
export class ScannerPermissionService {
  private static instance: ScannerPermissionService;
  
  private constructor() {}
  
  public static getInstance(): ScannerPermissionService {
    if (!ScannerPermissionService.instance) {
      ScannerPermissionService.instance = new ScannerPermissionService();
    }
    return ScannerPermissionService.instance;
  }
  
  /**
   * فتح إعدادات التطبيق
   */
  public async openAppSettings(): Promise<void> {
    try {
      console.log('[ScannerPermissionService] محاولة فتح إعدادات التطبيق...');
      
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerPermissionService] فتح الإعدادات باستخدام MLKit...');
        await BarcodeScanner.openSettings();
        return;
      }
      
      // الطريقة البديلة لفتح الإعدادات على نظام Android
      if (window.Capacitor?.getPlatform() === 'android') {
        console.log('[ScannerPermissionService] محاولة فتح إعدادات Android...');
        
        await Toast.show({
          text: 'يرجى فتح إعدادات جهازك وتمكين إذن الكاميرا للتطبيق يدويًا',
          duration: 'long'
        });
        
        setTimeout(() => App.exitApp(), 3000);
        return;
      }
      
      // الطريقة البديلة لنظام iOS
      if (window.Capacitor?.getPlatform() === 'ios') {
        console.log('[ScannerPermissionService] استخدام طريقة الخروج لـ iOS...');
        await Toast.show({
          text: 'سيتم إغلاق التطبيق، يرجى فتح إعدادات جهازك وتمكين إذن الكاميرا ثم إعادة فتح التطبيق',
          duration: 'long'
        });
        setTimeout(() => App.exitApp(), 3000);
        return;
      }
      
      console.warn('[ScannerPermissionService] لا يمكن فتح الإعدادات تلقائيًا');
      await Toast.show({
        text: 'يرجى فتح إعدادات الجهاز وتمكين إذن الكاميرا للتطبيق يدويًا',
        duration: 'long'
      });
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في فتح الإعدادات:', error);
      try {
        await Toast.show({
          text: 'يرجى فتح إعدادات الجهاز وتمكين إذن الكاميرا للتطبيق يدويًا',
          duration: 'long'
        });
      } catch (e) {
        console.error('[ScannerPermissionService] خطأ في عرض الرسالة:', e);
        alert('يرجى فتح إعدادات الجهاز وتمكين إذن الكاميرا للتطبيق يدويًا');
      }
    }
  }
  
  /**
   * التحقق مما إذا كان الماسح مدعومًا على الجهاز
   */
  public async isSupported(): Promise<boolean> {
    try {
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        return false;
      }
      
      const result = await BarcodeScanner.isSupported();
      return result.supported;
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
      if (!await this.isSupported()) {
        console.log('[ScannerPermissionService] الماسح غير مدعوم');
        return false;
      }
      
      console.log('[ScannerPermissionService] طلب إذن الكاميرا من MLKit...');
      const { camera } = await BarcodeScanner.requestPermissions();
      console.log('[ScannerPermissionService] نتيجة طلب الإذن:', camera);
      
      return camera === 'granted';
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
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerPermissionService] MLKit غير متوفر');
        return false;
      }
      
      console.log('[ScannerPermissionService] فحص حالة إذن الكاميرا...');
      const { camera } = await BarcodeScanner.checkPermissions();
      console.log('[ScannerPermissionService] نتيجة فحص الإذن:', camera);
      
      return camera === 'granted';
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من إذن الكاميرا:', error);
      return false;
    }
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerPermissionService = ScannerPermissionService.getInstance();
