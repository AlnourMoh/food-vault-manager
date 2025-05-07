
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';

/**
 * خدمة تتحكم في وظائف كاميرا الماسح الضوئي
 */
export class ScannerCameraService {
  private static instance: ScannerCameraService;
  
  private constructor() {}
  
  public static getInstance(): ScannerCameraService {
    if (!ScannerCameraService.instance) {
      ScannerCameraService.instance = new ScannerCameraService();
    }
    return ScannerCameraService.instance;
  }
  
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isScannerSupported(): Promise<boolean> {
    try {
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        return false;
      }
      
      const result = await BarcodeScanner.isSupported();
      return result.supported;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في التحقق من دعم الماسح:', error);
      return false;
    }
  }
  
  /**
   * تحضير وإعداد الكاميرا للمسح
   */
  public async prepareCamera(): Promise<boolean> {
    try {
      console.log('[ScannerCameraService] تحضير الكاميرا...');
      
      // إظهار خلفية الكاميرا
      await BarcodeScanner.showBackground();
      
      // تهيئة الكاميرا للمسح
      await BarcodeScanner.prepare();
      
      return true;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في تحضير الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * إيقاف الكاميرا وتنظيف الموارد
   */
  public async cleanupCamera(): Promise<void> {
    try {
      console.log('[ScannerCameraService] تنظيف موارد الكاميرا...');
      
      await BarcodeScanner.disableTorch().catch(() => {});
      await BarcodeScanner.stopScan().catch(() => {});
      await BarcodeScanner.hideBackground().catch(() => {});
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في تنظيف موارد الكاميرا:', error);
    }
  }
  
  /**
   * الحصول على خيارات التنسيقات المدعومة للمسح
   */
  public getScanFormatOptions() {
    return {
      formats: [
        BarcodeFormat.QrCode,
        BarcodeFormat.UpcA,
        BarcodeFormat.UpcE,
        BarcodeFormat.Ean8,
        BarcodeFormat.Ean13,
        BarcodeFormat.Code39,
        BarcodeFormat.Code128,
        BarcodeFormat.Itf,
        BarcodeFormat.Codabar
      ]
    };
  }
  
  /**
   * التبديل بين وضع الإضاءة
   */
  public async toggleTorch(): Promise<void> {
    try {
      const torchAvailable = await BarcodeScanner.isTorchAvailable();
      if (torchAvailable.available) {
        await BarcodeScanner.toggleTorch();
      } else {
        await Toast.show({
          text: 'الفلاش غير متوفر على هذا الجهاز',
          duration: 'short'
        });
      }
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في تبديل وضع الفلاش:', error);
    }
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerCameraService = ScannerCameraService.getInstance();
