
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

/**
 * خدمة للتعامل مع كاميرا الماسح الضوئي
 */
export class ScannerCameraService {
  private static instance: ScannerCameraService;
  private isTorchEnabled = false;
  
  private constructor() {}
  
  public static getInstance(): ScannerCameraService {
    if (!ScannerCameraService.instance) {
      ScannerCameraService.instance = new ScannerCameraService();
    }
    return ScannerCameraService.instance;
  }
  
  /**
   * تهيئة الكاميرا للاستخدام
   */
  public async initialize(): Promise<boolean> {
    try {
      console.log('[ScannerCameraService] تهيئة الكاميرا');
      
      // التحقق من وجود الملحق
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerCameraService] ملحق MLKitBarcodeScanner غير متاح');
        return false;
      }
      
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
   * إيقاف المسح وتنظيف موارد الكاميرا
   */
  public async stopScanning(): Promise<boolean> {
    try {
      console.log('[ScannerCameraService] إيقاف المسح وتنظيف موارد الكاميرا');
      
      // التحقق من وجود الملحق
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        return false;
      }
      
      // إيقاف الفلاش إذا كان مفعلاً
      if (this.isTorchEnabled) {
        await this.disableTorch().catch(() => {});
      }
      
      // إيقاف المسح
      await BarcodeScanner.stopScan().catch(() => {});
      
      return true;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في إيقاف المسح:', error);
      return false;
    }
  }
  
  /**
   * التبديل بين تشغيل وإيقاف الفلاش
   */
  public async toggleTorch(): Promise<boolean> {
    try {
      // التحقق من وجود الملحق
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        return false;
      }
      
      if (this.isTorchEnabled) {
        return await this.disableTorch();
      } else {
        return await this.enableTorch();
      }
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في تبديل حالة الفلاش:', error);
      return false;
    }
  }
  
  /**
   * تفعيل الفلاش
   */
  public async enableTorch(): Promise<boolean> {
    try {
      // التحقق من وجود الملحق
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        return false;
      }
      
      await BarcodeScanner.enableTorch();
      this.isTorchEnabled = true;
      
      return true;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في تفعيل الفلاش:', error);
      return false;
    }
  }
  
  /**
   * إلغاء تفعيل الفلاش
   */
  public async disableTorch(): Promise<boolean> {
    try {
      // التحقق من وجود الملحق
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        return false;
      }
      
      await BarcodeScanner.disableTorch();
      this.isTorchEnabled = false;
      
      return true;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في إلغاء تفعيل الفلاش:', error);
      return false;
    }
  }
  
  /**
   * التحقق من توفر الفلاش
   */
  public async isTorchAvailable(): Promise<boolean> {
    try {
      // التحقق من وجود الملحق
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        return false;
      }
      
      const result = await BarcodeScanner.isTorchAvailable();
      return result.available;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في التحقق من توفر الفلاش:', error);
      return false;
    }
  }
}

// تصدير نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerCameraService = ScannerCameraService.getInstance();
