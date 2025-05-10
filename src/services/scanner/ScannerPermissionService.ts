
/**
 * خدمة إدارة أذونات الماسح الضوئي
 */
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { DeviceSupportChecker } from './permission/DeviceSupportChecker';
import { PermissionStatusChecker } from './permission/PermissionStatusChecker';
import { CameraPermissionRequester } from './permission/CameraPermissionRequester';
import { AppSettingsOpener } from './permission/AppSettingsOpener';
import { BrowserPermissionService } from './permission/BrowserPermissionService';

export class ScannerPermissionService {
  private deviceSupportChecker = new DeviceSupportChecker();
  private permissionStatusChecker = new PermissionStatusChecker();
  private cameraPermissionRequester = new CameraPermissionRequester();
  private browserPermissionService = new BrowserPermissionService();
  
  /**
   * فحص وجود إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: فحص إذن الكاميرا');
      
      // تسجيل معلومات عن بيئة التشغيل للمساعدة في تشخيص المشاكل
      console.log('ScannerPermissionService: المنصة:', Capacitor.getPlatform());
      console.log('ScannerPermissionService: بيئة نظام أصلي؟', Capacitor.isNativePlatform());
      
      // تنفيذ الفحص من خلال خدمة متخصصة
      const hasPermission = await this.permissionStatusChecker.checkPermissionStatus();
      
      console.log('ScannerPermissionService: نتيجة فحص الإذن:', hasPermission);
      
      // إذا لم يتم منح الإذن، نعرض رسالة للمستخدم
      if (!hasPermission) {
        await Toast.show({
          text: 'لم يتم منح إذن الكاميرا. يرجى السماح باستخدام الكاميرا',
          duration: 'short'
        });
      }
      
      return hasPermission;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في فحص الإذن:', error);
      
      await Toast.show({
        text: 'حدث خطأ أثناء التحقق من أذونات الكاميرا',
        duration: 'short'
      });
      
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
      
      // عرض رسالة للمستخدم
      await Toast.show({
        text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
        duration: 'short'
      });
      
      // طلب الإذن بناءً على البيئة
      if (Capacitor.isNativePlatform()) {
        // طلب الإذن في البيئة الأصلية (تطبيق جوال)
        console.log('ScannerPermissionService: طلب إذن الكاميرا في بيئة التطبيق الأصلي');
        return await this.cameraPermissionRequester.requestPermission();
      } else {
        // طلب الإذن في بيئة الويب
        console.log('ScannerPermissionService: طلب إذن الكاميرا في بيئة الويب');
        return await this.browserPermissionService.requestBrowserPermission();
      }
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
    
    // عرض رسالة توضيحية للمستخدم
    await Toast.show({
      text: 'جاري توجيهك إلى إعدادات التطبيق لتمكين إذن الكاميرا',
      duration: 'short'
    });
    
    return await AppSettingsOpener.openAppSettings();
  }
  
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    try {
      const supported = await this.deviceSupportChecker.checkDeviceSupport();
      
      if (!supported) {
        await Toast.show({
          text: 'الجهاز لا يدعم مسح الباركود',
          duration: 'short'
        });
      }
      
      return supported;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في التحقق من دعم الجهاز:', error);
      return false;
    }
  }
}

// إنشاء نسخة مفردة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerPermissionService = new ScannerPermissionService();
