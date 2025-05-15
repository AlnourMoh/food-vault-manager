
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import '@/types/barcode-scanner-augmentation.d.ts';

/**
 * خدمة للتعامل مع كاميرا المسح الضوئي
 */
class ScannerCameraService {
  private static instance: ScannerCameraService;
  private isInitialized = false;
  
  private constructor() {}
  
  public static getInstance(): ScannerCameraService {
    if (!ScannerCameraService.instance) {
      ScannerCameraService.instance = new ScannerCameraService();
    }
    return ScannerCameraService.instance;
  }
  
  /**
   * تهيئة كاميرا المسح
   */
  public async initialize(): Promise<boolean> {
    try {
      console.log('[ScannerCameraService] تهيئة كاميرا المسح');
      
      if (this.isInitialized) {
        console.log('[ScannerCameraService] الكاميرا مهيأة بالفعل');
        return true;
      }
      
      // تحقق من توفر الملحق
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerCameraService] ملحق MLKitBarcodeScanner غير متاح');
        return false;
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في تهيئة كاميرا المسح:', error);
      this.isInitialized = false;
      return false;
    }
  }
  
  /**
   * إيقاف المسح وتنظيف موارد الكاميرا
   */
  public async stopScanning(): Promise<boolean> {
    try {
      console.log('[ScannerCameraService] إيقاف المسح وتنظيف موارد الكاميرا');
      
      if (!this.isInitialized) {
        console.log('[ScannerCameraService] الكاميرا غير مهيأة، لا حاجة للتنظيف');
        return true;
      }
      
      // تحقق من توفر الملحق وإيقاف المسح
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        // إيقاف تشغيل الفلاش إن وجد
        await BarcodeScanner.enableTorch(false).catch(() => {});
        
        // استدعاء stopScan بدون معاملات
        await BarcodeScanner.stopScan();
      }
      
      this.isInitialized = false;
      return true;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في إيقاف المسح:', error);
      this.isInitialized = false;
      return false;
    }
  }
  
  /**
   * تبديل حالة الفلاش
   */
  public async toggleFlash(): Promise<boolean> {
    try {
      console.log('[ScannerCameraService] تبديل حالة الفلاش');
      
      if (!this.isInitialized) {
        console.log('[ScannerCameraService] الكاميرا غير مهيأة، لا يمكن تبديل الفلاش');
        return false;
      }
      
      // تحقق من توفر الملحق وتبديل الفلاش
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        // الحصول على حالة الفلاش الحالية
        const isTorchEnabled = await BarcodeScanner.isTorchEnabled();
        
        // تبديل الفلاش
        await BarcodeScanner.enableTorch(!isTorchEnabled.enabled);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في تبديل الفلاش:', error);
      return false;
    }
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerCameraService = ScannerCameraService.getInstance();
