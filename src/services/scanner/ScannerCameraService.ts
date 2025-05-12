
/**
 * خدمة التحكم بالكاميرا للماسح الضوئي
 */

import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ScannerUIService } from './ui/ScannerUIService';
import { scannerPermissionService } from './ScannerPermissionService';

export class ScannerCameraService {
  private static instance: ScannerCameraService;
  private isActive = false;
  private readonly uiService = new ScannerUIService();
  
  /**
   * الحصول على نسخة وحيدة من الخدمة (Singleton)
   */
  public static getInstance(): ScannerCameraService {
    if (!ScannerCameraService.instance) {
      ScannerCameraService.instance = new ScannerCameraService();
    }
    return ScannerCameraService.instance;
  }
  
  /**
   * التحقق من حالة نشاط الكاميرا
   */
  public isScanning(): boolean {
    return this.isActive;
  }
  
  /**
   * تهيئة الكاميرا وتجهيزها للمسح
   */
  public async initialize(): Promise<boolean> {
    try {
      // التحقق من وجود الملحق أولاً
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.warn('[ScannerCameraService] ملحق MLKitBarcodeScanner غير متاح');
        return false;
      }
      
      // التحقق من وجود إذن للكاميرا
      const hasPermission = await scannerPermissionService.checkPermission();
      if (!hasPermission) {
        console.warn('[ScannerCameraService] لا يوجد إذن للكاميرا');
        return false;
      }
      
      // إعداد الكاميرا وتهيئتها - استخدام createVideoElement بدلاً من prepareBackground
      const videoElement = this.uiService.createVideoElement();
      this.uiService.activateScanningUI(videoElement);
      
      // تهيئة الكاميرا
      await BarcodeScanner.prepare();
      
      console.log('[ScannerCameraService] تمت تهيئة الكاميرا بنجاح');
      return true;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في تهيئة الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * إيقاف الماسح الضوئي وتنظيف الموارد
   */
  public async stopScanning(): Promise<void> {
    try {
      // التحقق من حالة النشاط قبل المحاولة
      if (!this.isActive) {
        return;
      }
      
      console.log('[ScannerCameraService] إيقاف المسح الضوئي...');
      
      // إيقاف المسح وتعطيل المصباح
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        await BarcodeScanner.disableTorch().catch(e => console.error('[ScannerCameraService] خطأ في تعطيل المصباح:', e));
        await BarcodeScanner.stopScan().catch(e => console.error('[ScannerCameraService] خطأ في إيقاف المسح:', e));
      }
      
      // إعادة ضبط واجهة المستخدم - استخدام deactivateScanningUI بدلاً من restoreBackground
      this.uiService.deactivateScanningUI();
      this.uiService.removeVideoElement();
      
      // تحديث الحالة
      this.isActive = false;
      
      console.log('[ScannerCameraService] تم إيقاف المسح الضوئي بنجاح');
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في إيقاف المسح الضوئي:', error);
      this.isActive = false;
    }
  }
}

// تصدير نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerCameraService = ScannerCameraService.getInstance();
