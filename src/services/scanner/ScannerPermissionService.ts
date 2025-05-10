
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { Toast } from '@capacitor/toast';
import { CameraPermissionRequester } from './permission/CameraPermissionRequester';
import { AppSettingsOpener } from './permission/AppSettingsOpener';

/**
 * خدمة إدارة أذونات الماسح الضوئي
 */
class ScannerPermissionService {
  private permissionRequester: CameraPermissionRequester;
  
  constructor() {
    this.permissionRequester = new CameraPermissionRequester();
  }
  
  /**
   * التحقق من وجود إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: التحقق من إذن الكاميرا');
      
      // في بيئة المتصفح، نعتبر أن لدينا الإذن (سيتم التحقق عند الاستخدام الفعلي)
      if (!Capacitor.isNativePlatform()) {
        console.log('ScannerPermissionService: نحن في بيئة الويب، سنفترض وجود الإذن');
        return true;
      }
      
      // التحقق من توفر ملحقات الكاميرا
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('ScannerPermissionService: استخدام MLKit للتحقق من الإذن');
        const status = await BarcodeScanner.checkPermissions();
        console.log('ScannerPermissionService: حالة إذن MLKit:', status);
        return status.camera === 'granted';
      }
      
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('ScannerPermissionService: استخدام Camera للتحقق من الإذن');
        const status = await Camera.checkPermissions();
        console.log('ScannerPermissionService: حالة إذن Camera:', status);
        return status.camera === 'granted';
      }
      
      // إذا لم تكن هناك ملحقات، نفترض عدم وجود الإذن
      console.log('ScannerPermissionService: لا توجد ملحقات كاميرا متاحة');
      return false;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في التحقق من الإذن:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: طلب إذن الكاميرا');
      
      // التحقق أولاً مما إذا كان الإذن ممنوحًا بالفعل
      const hasPermission = await this.checkPermission();
      if (hasPermission) {
        console.log('ScannerPermissionService: الإذن ممنوح بالفعل');
        
        await Toast.show({
          text: 'تم منح إذن الكاميرا بالفعل',
          duration: 'short'
        });
        
        return true;
      }
      
      // استخدام خدمة طلب الإذن
      return await this.permissionRequester.requestPermission();
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في طلب الإذن:', error);
      return false;
    }
  }
  
  /**
   * فتح إعدادات التطبيق
   */
  public async openAppSettings(): Promise<boolean> {
    return await AppSettingsOpener.openAppSettings();
  }
  
  /**
   * التحقق من دعم الماسح الضوئي على الجهاز
   */
  public async isSupported(): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform()) {
        // في بيئة الويب، نتحقق من دعم mediaDevices
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      }
      
      // التحقق من توفر ملحقات الماسح الضوئي
      const mlkitAvailable = Capacitor.isPluginAvailable('MLKitBarcodeScanner');
      const cameraAvailable = Capacitor.isPluginAvailable('Camera');
      
      // تسجيل نتيجة التحقق
      console.log('ScannerPermissionService: التحقق من الدعم - MLKit:', mlkitAvailable, 'Camera:', cameraAvailable);
      
      return mlkitAvailable || cameraAvailable;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في التحقق من الدعم:', error);
      return false;
    }
  }
}

// تصدير نسخة واحدة من الخدمة للاستخدام في التطبيق
export const scannerPermissionService = new ScannerPermissionService();
