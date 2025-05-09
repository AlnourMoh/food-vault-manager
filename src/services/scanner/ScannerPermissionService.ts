
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';
import { DeviceSupportChecker } from './permission/DeviceSupportChecker';
import { PermissionStatusChecker } from './permission/PermissionStatusChecker';
import { AppSettingsOpener } from './permission/AppSettingsOpener';

class ScannerPermissionService {
  private permissionDeniedCount: number = 0;
  private deviceSupportChecker: DeviceSupportChecker;
  private permissionStatusChecker: PermissionStatusChecker;
  private appSettingsOpener: AppSettingsOpener;
  
  constructor() {
    this.deviceSupportChecker = new DeviceSupportChecker();
    this.permissionStatusChecker = new PermissionStatusChecker();
    this.appSettingsOpener = new AppSettingsOpener();
  }
  
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    return await this.deviceSupportChecker.checkDeviceSupport();
  }
  
  /**
   * التحقق من حالة إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    return await this.permissionStatusChecker.checkPermissionStatus();
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: جاري طلب إذن الكاميرا...');
      this.permissionDeniedCount++;
      
      // إذا تجاوزنا 3 محاولات، نحاول فتح الإعدادات مباشرة
      if (this.permissionDeniedCount > 3) {
        console.log('ScannerPermissionService: تجاوز الحد الأقصى للمحاولات، محاولة فتح الإعدادات');
        await Toast.show({
          text: 'يرجى تمكين إذن الكاميرا من إعدادات جهازك',
          duration: 'long'
        });
        
        return await this.openAppSettings();
      }
      
      // محاولة 1: استخدام ملحق MLKitBarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('ScannerPermissionService: محاولة طلب الإذن من MLKitBarcodeScanner...');
        
        const result = await BarcodeScanner.requestPermissions();
        const granted = result.camera === 'granted';
        
        console.log('ScannerPermissionService: نتيجة طلب إذن MLKitBarcodeScanner:', granted);
        
        if (granted) {
          this.permissionDeniedCount = 0;
          return true;
        }
      }
      
      // محاولة 2: استخدام ملحق Camera
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('ScannerPermissionService: محاولة طلب الإذن من Camera...');
        
        const result = await Camera.requestPermissions({
          permissions: ['camera']
        });
        const granted = result.camera === 'granted';
        
        console.log('ScannerPermissionService: نتيجة طلب إذن Camera:', granted);
        
        if (granted) {
          this.permissionDeniedCount = 0;
          return true;
        }
      }
      
      // محاولة 3: في بيئة الويب
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          console.log('ScannerPermissionService: محاولة طلب الإذن من متصفح الويب...');
          
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          
          // إيقاف المسار بعد التحقق
          stream.getTracks().forEach(track => track.stop());
          
          console.log('ScannerPermissionService: تم منح إذن كاميرا المتصفح');
          this.permissionDeniedCount = 0;
          return true;
        } catch (error) {
          console.error('ScannerPermissionService: تم رفض إذن كاميرا المتصفح:', error);
        }
      }
      
      // في حالة الوصول إلى هنا، لم يتم منح الإذن
      console.log('ScannerPermissionService: لم يتم منح الإذن');
      
      // بعد محاولتين، نقترح فتح الإعدادات
      if (this.permissionDeniedCount >= 2) {
        await Toast.show({
          text: 'يبدو أنك بحاجة إلى تمكين إذن الكاميرا من إعدادات جهازك',
          duration: 'long'
        });
        
        if (this.permissionDeniedCount >= 3) {
          await this.openAppSettings();
        }
      }
      
      return false;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * فتح إعدادات التطبيق
   */
  public async openAppSettings(): Promise<boolean> {
    return await this.appSettingsOpener.openSettings();
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerPermissionService = new ScannerPermissionService();
