
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';

/**
 * خدمة إدارة الكاميرا للماسح الضوئي
 */
export class ScannerCameraService {
  private static instance: ScannerCameraService;
  private isMockModeEnabled = false;

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
   * تحقق مما إذا كان التطبيق في وضع المحاكاة
   */
  public isMockMode(): boolean {
    return this.isMockModeEnabled;
  }
  
  /**
   * تمكين أو تعطيل وضع المحاكاة
   */
  public setMockMode(enabled: boolean): void {
    this.isMockModeEnabled = enabled;
    console.log(`[ScannerCameraService] تم ${enabled ? 'تمكين' : 'تعطيل'} وضع المحاكاة`);
  }
  
  /**
   * تحضير الكاميرا
   */
  public async prepareCamera(): Promise<boolean> {
    try {
      // إذا كان في وضع المحاكاة، نتظاهر بأن الكاميرا جاهزة
      if (this.isMockMode()) {
        console.log('[ScannerCameraService] وضع المحاكاة: تجاوز تحضير الكاميرا');
        return true;
      }
      
      // في بيئة الويب، نفترض أن الكاميرا ستكون جاهزة
      if (!Capacitor.isNativePlatform()) {
        return true;
      }
      
      // التأكد من أن MLKit متاح
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.error('[ScannerCameraService] ملحق MLKitBarcodeScanner غير متاح');
        return false;
      }
      
      // تحضير الكاميرا
      console.log('[ScannerCameraService] تحضير الكاميرا');
      // التصحيح: استدعاء الدالة بدون وسائط
      await BarcodeScanner.prepare();
      console.log('[ScannerCameraService] تم تحضير الكاميرا');
      
      return true;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في تحضير الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * تنظيف موارد الكاميرا
   */
  public async cleanupCamera(): Promise<boolean> {
    try {
      // في وضع المحاكاة أو الويب، لا حاجة لتنظيف الموارد
      if (this.isMockMode() || !Capacitor.isNativePlatform()) {
        return true;
      }
      
      // التأكد من أن MLKit متاح
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        return true;
      }
      
      // تنظيف الكاميرا
      console.log('[ScannerCameraService] تنظيف موارد الكاميرا');
      
      // إيقاف الكاميرا باستخدام 'enableTorch' لإغلاق الفلاش أولاً إذا كان مفعلاً
      try {
        await BarcodeScanner.enableTorch({ value: false });
      } catch {
        // تجاهل أي خطأ هنا
      }
      
      // ثم إطلاق موارد الكاميرا
      await BarcodeScanner.stopScan();
      
      console.log('[ScannerCameraService] تم تنظيف موارد الكاميرا');
      
      return true;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في تنظيف موارد الكاميرا:', error);
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
      
      // انتظار لحظة قبل إعادة التهيئة
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // إعادة تحضير الكاميرا
      return await this.prepareCamera();
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في إعادة تعيين الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * الحصول على خيارات تنسيق المسح
   */
  public getScanFormatOptions() {
    return {
      formats: [
        'QR_CODE',
        'DATA_MATRIX',
        'UPC_A',
        'UPC_E',
        'EAN_8',
        'EAN_13',
        'CODE_39',
        'CODE_93',
        'CODE_128',
        'ITF',
        'CODABAR'
      ]
    };
  }
}

// تصدير مثيل الخدمة
export const scannerCameraService = ScannerCameraService.getInstance();
