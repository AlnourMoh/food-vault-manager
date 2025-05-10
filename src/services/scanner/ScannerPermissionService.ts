
/**
 * خدمة إدارة أذونات الماسح الضوئي
 */
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { DeviceSupportChecker } from './permission/DeviceSupportChecker';
import { PermissionStatusChecker } from './permission/PermissionStatusChecker';
import { CameraPermissionRequester } from './permission/CameraPermissionRequester';
import { AppSettingsOpener } from './permission/AppSettingsOpener';

export class ScannerPermissionService {
  private deviceSupportChecker = new DeviceSupportChecker();
  private permissionStatusChecker = new PermissionStatusChecker();
  private cameraPermissionRequester = new CameraPermissionRequester();
  
  /**
   * فحص وجود إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: فحص إذن الكاميرا');
      return await this.permissionStatusChecker.checkPermissionStatus();
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
      
      // التحقق من وجود الإذن بالفعل
      const hasPermission = await this.checkPermission();
      if (hasPermission) {
        console.log('ScannerPermissionService: الإذن ممنوح بالفعل');
        return true;
      }
      
      // طلب الإذن باستخدام الخدمة المتخصصة
      return await this.cameraPermissionRequester.requestPermission();
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في طلب الإذن:', error);
      
      await Toast.show({
        text: 'حدث خطأ أثناء طلب إذن الكاميرا',
        duration: 'short'
      });
      
      return false;
    }
  }
  
  /**
   * فتح إعدادات التطبيق لتمكين الإذن
   */
  public async openAppSettings(): Promise<boolean> {
    console.log('ScannerPermissionService: فتح إعدادات التطبيق');
    return await AppSettingsOpener.openAppSettings();
  }
  
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    return await this.deviceSupportChecker.checkDeviceSupport();
  }
}

// إنشاء نسخة مفردة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerPermissionService = new ScannerPermissionService();
