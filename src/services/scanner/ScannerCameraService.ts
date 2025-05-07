
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { BarcodeScannerPlugin } from '@/types/barcode-scanner';

/**
 * خدمة تتحكم في وظائف كاميرا الماسح الضوئي
 */
export class ScannerCameraService {
  private static instance: ScannerCameraService;
  private isCameraReady: boolean = false;
  
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
   * تحضير وإعداد الكاميرا للمسح - تم تحسينها للاستجابة السريعة
   */
  public async prepareCamera(): Promise<boolean> {
    try {
      console.log('[ScannerCameraService] تحضير الكاميرا...');
      
      if (this.isCameraReady) {
        console.log('[ScannerCameraService] الكاميرا جاهزة بالفعل');
        return true;
      }
      
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.error('[ScannerCameraService] MLKit غير متوفر على هذا الجهاز');
        return false;
      }

      try {
        // تهيئة سريعة للكاميرا بدون انتظار
        await BarcodeScanner.prepare();
        this.isCameraReady = true;
      } catch (error) {
        console.error('[ScannerCameraService] خطأ في تفعيل الكاميرا:', error);
      }
      
      return this.isCameraReady;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في تحضير الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * إيقاف الكاميرا وتنظيف الموارد - تم تحسينها للعمل بشكل أسرع
   */
  public async cleanupCamera(): Promise<void> {
    try {
      console.log('[ScannerCameraService] تنظيف موارد الكاميرا...');
      
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        return;
      }
      
      // إيقاف الكاميرا بشكل سريع بدون انتظار طويل
      await Promise.all([
        BarcodeScanner.disableTorch().catch(() => {}),
        BarcodeScanner.stopScan().catch(() => {})
      ]);
      
      this.isCameraReady = false;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في تنظيف موارد الكاميرا:', error);
      this.isCameraReady = false;
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
   * التبديل بين وضع الإضاءة بشكل فوري
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
