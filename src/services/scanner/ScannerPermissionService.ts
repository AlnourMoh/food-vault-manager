
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { AppSettingsOpener } from './permission/AppSettingsOpener';

/**
 * خدمة لإدارة أذونات الماسح الضوئي
 */
export class ScannerPermissionService {
  private static instance: ScannerPermissionService;

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
   * التحقق مما إذا كان الجهاز يدعم مسح الباركود
   */
  public async isSupported(): Promise<boolean> {
    try {
      // في بيئة الويب، نتحقق من دعم getUserMedia
      if (!Capacitor.isNativePlatform()) {
        return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
      }
      
      // التحقق من توفر ملحق MLKit
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
        const result = await BarcodeScanner.isSupported();
        return result.supported;
      }
      
      // التحقق من توفر ملحق الكاميرا
      if (Capacitor.isPluginAvailable('Camera')) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من الدعم:', error);
      return false;
    }
  }
  
  /**
   * التحقق من إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      // في بيئة الويب، نتعامل مع أذونات المتصفح
      if (!Capacitor.isNativePlatform()) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          return devices.some(device => device.kind === 'videoinput');
        } catch {
          return false;
        }
      }
      
      // التحقق من إذن ملحق MLKit
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
        const status = await BarcodeScanner.checkPermissions();
        return status.camera === 'granted';
      }
      
      // التحقق من إذن ملحق الكاميرا
      if (Capacitor.isPluginAvailable('Camera')) {
        const { Camera } = await import('@capacitor/camera');
        const status = await Camera.checkPermissions();
        return status.camera === 'granted';
      }
      
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
      await Toast.show({
        text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
        duration: 'short'
      });
      
      // في بيئة الويب، نستخدم واجهة المتصفح
      if (!Capacitor.isNativePlatform()) {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          return true;
        } catch {
          return false;
        }
      }
      
      // طلب إذن ملحق MLKit
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
        const status = await BarcodeScanner.requestPermissions();
        return status.camera === 'granted';
      }
      
      // طلب إذن ملحق الكاميرا
      if (Capacitor.isPluginAvailable('Camera')) {
        const { Camera } = await import('@capacitor/camera');
        const status = await Camera.requestPermissions();
        return status.camera === 'granted';
      }
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في طلب الإذن:', error);
      return false;
    }
  }

  /**
   * فتح إعدادات التطبيق
   */
  public async openAppSettings(): Promise<boolean> {
    try {
      return await AppSettingsOpener.openAppSettings();
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في فتح إعدادات التطبيق:', error);
      return false;
    }
  }
}

// تصدير مثيل الخدمة
export const scannerPermissionService = ScannerPermissionService.getInstance();
