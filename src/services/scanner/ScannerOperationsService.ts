
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { scannerPermissionService } from './ScannerPermissionService';
import { scannerUIService } from './ScannerUIService';

/**
 * خدمة مسؤولة عن عمليات المسح الضوئي
 */
export class ScannerOperationsService {
  private static instance: ScannerOperationsService;
  private isScanning = false;
  
  private constructor() {}
  
  public static getInstance(): ScannerOperationsService {
    if (!ScannerOperationsService.instance) {
      ScannerOperationsService.instance = new ScannerOperationsService();
    }
    return ScannerOperationsService.instance;
  }
  
  /**
   * فحص وإعداد كل ما هو مطلوب قبل بدء المسح
   */
  public async prepareScanner(): Promise<boolean> {
    // التحقق من دعم الماسح
    const isSupported = await scannerPermissionService.isSupported();
    if (!isSupported) {
      console.log('[ScannerOperationsService] الماسح غير مدعوم على هذا الجهاز');
      // عرض رسالة للمستخدم أن الجهاز لا يدعم ماسح الباركود
      await Toast.show({
        text: 'هذا الجهاز لا يدعم ماسح الباركود',
        duration: 'long'
      });
      return false;
    }
    
    // التحقق من إذن الكاميرا
    const hasPermission = await scannerPermissionService.checkPermission();
    if (!hasPermission) {
      console.log('[ScannerOperationsService] لا يوجد إذن للكاميرا، محاولة طلبه...');
      
      // عرض رسالة توضيحية قبل طلب الإذن
      await Toast.show({
        text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
        duration: 'short'
      });
      
      // طلب الإذن بعد ظهور الرسالة
      const permissionGranted = await scannerPermissionService.requestPermission();
      if (!permissionGranted) {
        console.log('[ScannerOperationsService] تم رفض إذن الكاميرا');
        
        // عرض رسالة للمستخدم بعد رفض الإذن
        await Toast.show({
          text: 'تم رفض إذن الكاميرا. لا يمكن استخدام الماسح الضوئي بدون هذا الإذن.',
          duration: 'long'
        });
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * بدء عملية المسح
   */
  public async startScan(onSuccess: (code: string) => void): Promise<boolean> {
    try {
      if (this.isScanning) {
        console.log('[ScannerOperationsService] الماسح نشط بالفعل');
        return true;
      }
      
      // عرض رسالة أن المسح سيبدأ
      await Toast.show({
        text: 'جاري تشغيل الماسح الضوئي... وجه الكاميرا إلى الباركود',
        duration: 'short'
      });
      
      // التأكد من جاهزية الماسح
      const isReady = await this.prepareScanner();
      if (!isReady) {
        console.log('[ScannerOperationsService] الماسح غير جاهز للاستخدام');
        return false;
      }
      
      // تعيين حالة المسح إلى نشط
      this.isScanning = true;
      
      // إعداد الواجهة للمسح
      scannerUIService.setupUIForScanning();
      
      // بدء المسح الفعلي مع محاولات متعددة
      const MAX_RETRIES = 2;
      
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`[ScannerOperationsService] محاولة المسح ${attempt}/${MAX_RETRIES}...`);
          
          // استخدام قيم enum للتنسيقات
          const result = await BarcodeScanner.scan({
            formats: [
              BarcodeFormat.QrCode,
              BarcodeFormat.UpcE,
              BarcodeFormat.UpcA,
              BarcodeFormat.Ean8,
              BarcodeFormat.Ean13,
              BarcodeFormat.Code39,
              BarcodeFormat.Code93,
              BarcodeFormat.Code128,
              BarcodeFormat.Itf,
              BarcodeFormat.Codabar
            ]
          });
          
          // معالجة النتيجة
          if (result.barcodes && result.barcodes.length > 0) {
            const code = result.barcodes[0].rawValue || '';
            console.log(`[ScannerOperationsService] تم العثور على باركود: ${code}`);
            
            // تنظيف الواجهة وإيقاف المسح
            await this.stopScan();
            
            // استدعاء دالة النجاح مع الرمز
            onSuccess(code);
            return true;
          } else {
            console.log('[ScannerOperationsService] لم يتم العثور على باركود في هذه المحاولة');
            
            // إذا كانت هذه المحاولة الأخيرة، نتوقف
            if (attempt === MAX_RETRIES) {
              console.log('[ScannerOperationsService] استنفذت جميع المحاولات');
              break;
            }
            
            // انتظار قصير قبل المحاولة التالية
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        } catch (error) {
          console.error(`[ScannerOperationsService] خطأ في محاولة المسح ${attempt}:`, error);
          
          if (attempt === MAX_RETRIES) {
            break;
          }
          
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      // إذا وصلنا إلى هنا، فهذا يعني أن جميع المحاولات فشلت
      await this.stopScan();
      
      // إظهار رسالة للمستخدم
      await Toast.show({
        text: 'لم يتم العثور على باركود. يرجى المحاولة مرة أخرى.',
        duration: 'long'
      });
      
      return false;
    } catch (error) {
      console.error('[ScannerOperationsService] خطأ في بدء المسح:', error);
      await this.stopScan();
      
      // إظهار رسالة خطأ للمستخدم
      await Toast.show({
        text: 'حدث خطأ أثناء المسح. يرجى المحاولة مرة أخرى.',
        duration: 'long'
      });
      
      return false;
    }
  }
  
  /**
   * إيقاف عملية المسح وتنظيف الموارد
   */
  public async stopScan(): Promise<void> {
    try {
      console.log('[ScannerOperationsService] إيقاف عملية المسح...');
      
      // استعادة الواجهة إلى حالتها الطبيعية
      scannerUIService.restoreUIAfterScanning();
      
      // محاولة إيقاف المسح من خلال MLKit
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          await BarcodeScanner.disableTorch().catch(() => {});
          await BarcodeScanner.stopScan().catch(() => {});
        } catch (e) {
          console.log('[ScannerOperationsService] خطأ غير مهم عند إيقاف المسح:', e);
        }
      }
      
      // تعيين حالة المسح إلى غير نشط
      this.isScanning = false;
    } catch (error) {
      console.error('[ScannerOperationsService] خطأ في إيقاف المسح:', error);
      // تعيين حالة المسح إلى غير نشط حتى في حالة الخطأ
      this.isScanning = false;
    }
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerOperationsService = ScannerOperationsService.getInstance();
