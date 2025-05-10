
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { scannerCameraService } from './ScannerCameraService';
import { AppSettingsOpener } from './permission/AppSettingsOpener';

/**
 * خدمة إدارة أذونات الكاميرا للماسح الضوئي
 */
export class ScannerPermissionService {
  private static instance: ScannerPermissionService;
  
  private constructor() {
    console.log('[ScannerPermissionService] تم إنشاء خدمة الأذونات');
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
   * التحقق من دعم الماسح الضوئي
   */
  public async isSupported(): Promise<boolean> {
    try {
      // إذا كنا في وضع المحاكاة، نعتبر الماسح مدعوماً دائماً
      if (scannerCameraService.isMockMode()) {
        return true;
      }
      
      // التحقق من دعم الماسح الضوئي في الجهاز
      if (Capacitor.isNativePlatform()) {
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          return await BarcodeScanner.isSupported();
        }
      }
      
      // للويب، نتحقق من وجود كاميرا
      return 'mediaDevices' in navigator && !!navigator.mediaDevices.getUserMedia;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من دعم الماسح:', error);
      return false;
    }
  }
  
  /**
   * التحقق من حالة إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      // إذا كنا في وضع المحاكاة، نعتبر الإذن ممنوحاً دائماً
      if (scannerCameraService.isMockMode()) {
        return true;
      }
      
      // التحقق من حالة الإذن حسب المنصة
      if (Capacitor.isNativePlatform()) {
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          const status = await BarcodeScanner.checkPermissions();
          return status.camera === 'granted';
        }
      }
      
      // للويب، نحاول الوصول إلى الكاميرا
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // إيقاف المسارات فوراً بعد التحقق
          stream.getTracks().forEach(track => track.stop());
          return true;
        } catch (error) {
          return false;
        }
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
      // إذا كنا في وضع المحاكاة، نعتبر الإذن ممنوحاً دائماً
      if (scannerCameraService.isMockMode()) {
        return true;
      }
      
      // طلب الإذن حسب المنصة
      if (Capacitor.isNativePlatform()) {
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          const status = await BarcodeScanner.requestPermissions();
          return status.camera === 'granted';
        }
      }
      
      // للويب، نحاول الوصول إلى الكاميرا
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // إيقاف المسارات فوراً بعد التحقق
          stream.getTracks().forEach(track => track.stop());
          return true;
        } catch (error) {
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * فتح إعدادات التطبيق للوصول إلى أذونات الكاميرا
   */
  public async openAppSettings(): Promise<boolean> {
    return AppSettingsOpener.openAppSettings();
  }
}

// تصدير مثيل الخدمة
export const scannerPermissionService = ScannerPermissionService.getInstance();
