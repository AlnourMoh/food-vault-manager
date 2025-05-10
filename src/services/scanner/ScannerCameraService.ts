
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

/**
 * خدمة تتحكم في وظائف كاميرا الماسح الضوئي
 */
export class ScannerCameraService {
  private static instance: ScannerCameraService;
  private isCameraReady: boolean = false;
  private initializationTimeout: number = 10000; // 10 ثواني كحد أقصى للتهيئة
  private initializationAttempts: number = 0;
  private maxAttempts: number = 3;
  
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
        console.log('[ScannerCameraService] ملحق MLKit غير متاح');
        
        // في بيئة الويب نتحقق من دعم getUserMedia
        if (!Capacitor.isNativePlatform()) {
          return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
        }
        return false;
      }
      
      const result = await BarcodeScanner.isSupported();
      console.log('[ScannerCameraService] نتيجة التحقق من دعم الماسح:', result);
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
      // إعادة تعيين متغير الجاهزية في كل محاولة جديدة
      this.isCameraReady = false;
      this.initializationAttempts++;
      
      console.log(`[ScannerCameraService] تحضير الكاميرا... محاولة ${this.initializationAttempts}/${this.maxAttempts}`);
      
      // إذا وصلنا للحد الأقصى من المحاولات، نقوم بعرض رسالة للمستخدم
      if (this.initializationAttempts > this.maxAttempts) {
        console.error('[ScannerCameraService] تم استنفاد الحد الأقصى من المحاولات');
        await Toast.show({
          text: 'فشل في تهيئة الكاميرا بعد عدة محاولات. يرجى التأكد من أذونات الكاميرا وإعادة تشغيل التطبيق.',
          duration: 'long'
        });
        return false;
      }
      
      if (!Capacitor.isNativePlatform()) {
        console.log('[ScannerCameraService] نحن في بيئة الويب، سنفترض أن الكاميرا ستعمل عند الطلب');
        this.isCameraReady = true;
        return true;
      }
      
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.error('[ScannerCameraService] MLKit غير متوفر على هذا الجهاز');
        await Toast.show({
          text: 'الماسح الضوئي غير مدعوم على هذا الجهاز.',
          duration: 'short'
        });
        return false;
      }

      // استخدام مهلة زمنية لمنع تعليق التطبيق في حالة فشل تهيئة الكاميرا
      const initPromise = new Promise<boolean>(async (resolve) => {
        try {
          console.log('[ScannerCameraService] بدء تهيئة الكاميرا...');
          
          // تحقق من الدعم أولاً
          const isSupported = await this.isScannerSupported();
          if (!isSupported) {
            console.error('[ScannerCameraService] الماسح غير مدعوم على هذا الجهاز');
            resolve(false);
            return;
          }
          
          // تهيئة الكاميرا
          await BarcodeScanner.prepare();
          console.log('[ScannerCameraService] تمت تهيئة الكاميرا بنجاح');
          this.isCameraReady = true;
          resolve(true);
        } catch (error) {
          console.error('[ScannerCameraService] خطأ في تفعيل الكاميرا:', error);
          
          // محاولة تنظيف الموارد السابقة قبل المحاولة مرة أخرى
          try {
            await this.cleanupCamera();
          } catch (cleanupError) {
            console.error('[ScannerCameraService] خطأ في تنظيف موارد الكاميرا:', cleanupError);
          }
          
          resolve(false);
        }
      });
      
      // إضافة مهلة زمنية لتجنب التجميد
      const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => {
          if (!this.isCameraReady) {
            console.error('[ScannerCameraService] انتهت مهلة تهيئة الكاميرا');
            resolve(false);
          }
        }, this.initializationTimeout);
      });
      
      // انتظار أول ما يتحقق (النجاح أو انتهاء المهلة)
      const result = await Promise.race([initPromise, timeoutPromise]);
      
      if (!result && this.initializationAttempts < this.maxAttempts) {
        console.log('[ScannerCameraService] محاولة إعادة تهيئة الكاميرا...');
        return await this.prepareCamera(); // محاولة أخرى
      }
      
      return result;
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
      
      if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerCameraService] لا حاجة لتنظيف الموارد');
        this.isCameraReady = false;
        return;
      }
      
      // قائمة بالعمليات التي نريد تنفيذها
      const operations = [
        BarcodeScanner.disableTorch().catch(() => console.log('[ScannerCameraService] تجاهل خطأ إيقاف الفلاش')),
        BarcodeScanner.stopScan().catch(() => console.log('[ScannerCameraService] تجاهل خطأ إيقاف المسح')),
        BarcodeScanner.showBackground().catch(() => console.log('[ScannerCameraService] تجاهل خطأ إظهار الخلفية')),
        BarcodeScanner.enableCamera(false).catch(() => console.log('[ScannerCameraService] تجاهل خطأ تعطيل الكاميرا'))
      ];
      
      // تنفيذ كل العمليات بالتوازي
      await Promise.all(operations);
      
      console.log('[ScannerCameraService] تم تنظيف موارد الكاميرا بنجاح');
      this.isCameraReady = false;
      this.initializationAttempts = 0; // إعادة تعيين عداد المحاولات
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
      if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerCameraService] غير قادر على تبديل الفلاش في هذه البيئة');
        return;
      }
      
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

  /**
   * إعادة تعيين حالة الكاميرا بالكامل - مفيد في حالة التعليق
   */
  public async resetCamera(): Promise<boolean> {
    console.log('[ScannerCameraService] إعادة تعيين حالة الكاميرا بالكامل');
    
    try {
      // تنظيف موارد الكاميرا أولاً
      await this.cleanupCamera();
      
      // انتظار لحظة قبل إعادة التهيئة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // إعادة تعيين عداد المحاولات وإعادة التهيئة
      this.initializationAttempts = 0;
      return await this.prepareCamera();
    } catch (error) {
      console.error('[ScannerCameraService] خطأ في إعادة تعيين الكاميرا:', error);
      return false;
    }
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerCameraService = ScannerCameraService.getInstance();
