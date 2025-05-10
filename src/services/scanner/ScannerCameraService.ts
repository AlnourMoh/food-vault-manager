
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

/**
 * خدمة إدارة الكاميرا للماسح الضوئي
 */
export class ScannerCameraService {
  private static instance: ScannerCameraService;
  private mockMode = false;
  
  private constructor() {
    console.log('[ScannerCameraService] تهيئة خدمة الكاميرا');
  }
  
  /**
   * الحصول على مثيل الخدمة (Singleton)
   */
  public static getInstance(): ScannerCameraService {
    if (!this.instance) {
      this.instance = new ScannerCameraService();
    }
    return this.instance;
  }
  
  /**
   * التحقق مما إذا كان وضع المحاكاة نشطًا
   */
  public isMockMode(): boolean {
    return this.mockMode || !Capacitor.isPluginAvailable('MLKitBarcodeScanner');
  }
  
  /**
   * تمكين أو تعطيل وضع المحاكاة
   */
  public enableMockMode(enabled: boolean): void {
    console.log(`[ScannerCameraService] تعيين وضع المحاكاة إلى: ${enabled}`);
    this.mockMode = enabled;
  }
  
  /**
   * تحضير الكاميرا للاستخدام
   */
  public async prepareCamera(): Promise<boolean> {
    try {
      // إذا كنا في وضع المحاكاة، نقوم بمحاكاة تفعيل الكاميرا دائمًا
      if (this.isMockMode()) {
        console.log('[ScannerCameraService] وضع المحاكاة نشط، إرجاع نجاح افتراضي');
        return true;
      }
      
      // محاولة تحضير الكاميرا الحقيقية إذا كنا في بيئة أصلية
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerCameraService] محاولة تحضير الكاميرا الحقيقية');
        
        try {
          // تهيئة الكاميرا
          await BarcodeScanner.prepare();
          console.log('[ScannerCameraService] تم تحضير الكاميرا بنجاح');
          return true;
        } catch (error) {
          console.error('[ScannerCameraService] خطأ في تحضير الكاميرا:', error);
          return false;
        }
      }
      
      // إذا وصلنا إلى هنا، فنحن في بيئة الويب أو لا نستخدم MLKit
      console.log('[ScannerCameraService] المنصة غير مدعومة أو MLKit غير متاح، إرجاع نجاح افتراضي');
      return true;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ غير متوقع في تحضير الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * تنظيف موارد الكاميرا
   */
  public async cleanupCamera(): Promise<boolean> {
    try {
      // لا شيء للتنظيف في وضع المحاكاة
      if (this.isMockMode()) {
        return true;
      }
      
      // تنظيف موارد الكاميرا الحقيقية
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          await BarcodeScanner.enableTorch(false); // إيقاف الفلاش أولاً
          // محاولة إيقاف التجهيز
          await BarcodeScanner.stopScan();
          console.log('[ScannerCameraService] تم إيقاف المسح');
          
          return true;
        } catch (error) {
          console.error('[ScannerCameraService] خطأ في تنظيف الكاميرا:', error);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ غير متوقع في تنظيف الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * إعادة تعيين الكاميرا بالكامل
   */
  public async resetCamera(): Promise<boolean> {
    try {
      // تنظيف الموارد أولاً
      await this.cleanupCamera();
      
      // محاولة إعادة تحضير الكاميرا
      return await this.prepareCamera();
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في إعادة تعيين الكاميرا:', error);
      return false;
    }
  }
}

// تصدير مثيل الخدمة
export const scannerCameraService = ScannerCameraService.getInstance();
