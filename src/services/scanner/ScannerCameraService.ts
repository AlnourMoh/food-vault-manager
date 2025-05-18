
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import '@/types/barcode-scanner-augmentation.d.ts';

/**
 * خدمة للتعامل مع كاميرا المسح الضوئي
 */
class ScannerCameraService {
  private static instance: ScannerCameraService;
  private isInitialized = false;
  private hasPermission = false;
  
  private constructor() {}
  
  public static getInstance(): ScannerCameraService {
    if (!ScannerCameraService.instance) {
      ScannerCameraService.instance = new ScannerCameraService();
    }
    return ScannerCameraService.instance;
  }
  
  /**
   * التحقق من دعم الماسح
   */
  public async isSupported(): Promise<boolean> {
    try {
      // التحقق أولاً من بيئة التنفيذ
      if (!Capacitor.isNativePlatform()) {
        console.log('[ScannerCameraService] ليست منصة أصلية، الماسح غير مدعوم');
        return false;
      }
      
      // التحقق من توفر ملحق المسح
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerCameraService] ملحق MLKitBarcodeScanner غير متوفر');
        return false;
      }
      
      // التحقق من دعم الجهاز للمسح
      try {
        const result = await BarcodeScanner.isSupported();
        console.log('[ScannerCameraService] نتيجة التحقق من الدعم:', result);
        return result.supported;
      } catch (error) {
        console.error('[ScannerCameraService] خطأ في التحقق من الدعم:', error);
        // في حالة الخطأ، نفترض أنه مدعوم ونترك التجربة تحدد ذلك
        return true;
      }
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في التحقق من دعم الماسح:', error);
      return false;
    }
  }
  
  /**
   * التحقق من وجود إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        return false;
      }
      
      const status = await BarcodeScanner.checkPermissions();
      console.log('[ScannerCameraService] حالة إذن الكاميرا:', status);
      
      this.hasPermission = status.camera === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في التحقق من إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        return false;
      }
      
      // التحقق أولاً من الإذن الحالي
      const status = await BarcodeScanner.checkPermissions();
      if (status.camera === 'granted') {
        this.hasPermission = true;
        return true;
      }
      
      // طلب الإذن
      console.log('[ScannerCameraService] طلب إذن الكاميرا');
      const result = await BarcodeScanner.requestPermissions();
      console.log('[ScannerCameraService] نتيجة طلب الإذن:', result);
      
      this.hasPermission = result.camera === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
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
      
      // تحقق من دعم الماسح
      if (!await this.isSupported()) {
        console.log('[ScannerCameraService] الماسح غير مدعوم');
        return false;
      }
      
      // التحقق من إذن الكاميرا
      if (!this.hasPermission) {
        const granted = await this.requestPermission();
        if (!granted) {
          console.log('[ScannerCameraService] لم يتم منح إذن الكاميرا');
          return false;
        }
      }
      
      // تهيئة الماسح
      try {
        console.log('[ScannerCameraService] تهيئة الماسح...');
        await BarcodeScanner.prepare();
        console.log('[ScannerCameraService] تم تهيئة الماسح بنجاح');
      } catch (error) {
        console.error('[ScannerCameraService] خطأ في تهيئة الماسح:', error);
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
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // إيقاف تشغيل الفلاش إن وجد
        try {
          await BarcodeScanner.enableTorch({ enable: false });
        } catch (e) {
          console.warn('[ScannerCameraService] خطأ في إيقاف الفلاش:', e);
        }
        
        // إخفاء خلفية الماسح
        try {
          await BarcodeScanner.hideBackground();
        } catch (e) {
          console.warn('[ScannerCameraService] خطأ في إخفاء الخلفية:', e);
        }
        
        // إيقاف المسح
        try {
          await BarcodeScanner.stopScan();
        } catch (e) {
          console.warn('[ScannerCameraService] خطأ في إيقاف المسح:', e);
        }
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
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // الحصول على حالة الفلاش الحالية
        const isTorchEnabled = await BarcodeScanner.isTorchEnabled();
        
        // تبديل الفلاش
        await BarcodeScanner.enableTorch({ enable: !isTorchEnabled.enabled });
        
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
