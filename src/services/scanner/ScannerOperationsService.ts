import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import '@/types/barcode-scanner-augmentation.d.ts';

/**
 * خدمة للتعامل مع عمليات المسح الضوئي
 */
class ScannerOperationsService {
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
   * بدء عملية المسح
   */
  public async startScan(): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      console.log('[ScannerOperationsService] بدء عملية المسح');
      
      if (this.isScanning) {
        console.log('[ScannerOperationsService] المسح نشط بالفعل');
        return { success: false, error: 'المسح نشط بالفعل' };
      }
      
      // تحقق من توفر ملحق المسح
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerOperationsService] ملحق MLKitBarcodeScanner غير متاح');
        
        await Toast.show({
          text: 'هذا الجهاز لا يدعم مسح الباركود',
          duration: 'long'
        });
        
        return { success: false, error: 'ملحق المسح غير متاح' };
      }
      
      // التحقق من دعم المسح
      const isSupportResult = await BarcodeScanner.isSupported();
      if (!isSupportResult.supported) {
        console.log('[ScannerOperationsService] الجهاز لا يدعم المسح:', isSupportResult);
        
        await Toast.show({
          text: 'هذا الجهاز لا يدعم مسح الباركود',
          duration: 'long'
        });
        
        return { success: false, error: 'الجهاز لا يدعم المسح' };
      }
      
      // التحقق من أذونات الكاميرا
      const { camera } = await BarcodeScanner.checkPermissions();
      
      if (camera !== 'granted') {
        console.log('[ScannerOperationsService] طلب إذن الكاميرا');
        
        const permissionResult = await BarcodeScanner.requestPermissions();
        
        if (permissionResult.camera !== 'granted') {
          console.log('[ScannerOperationsService] تم رفض إذن الكاميرا');
          
          await Toast.show({
            text: 'تم رفض إذن الكاميرا',
            duration: 'long'
          });
          
          return { success: false, error: 'تم رفض إذن الكاميرا' };
        }
      }
      
      this.isScanning = true;
      
      // بدء المسح
      const result = await BarcodeScanner.scan();
      
      this.isScanning = false;
      
      // معالجة النتائج
      if (result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue;
        
        if (code) {
          console.log('[ScannerOperationsService] تم مسح الرمز:', code);
          return { success: true, data: code };
        }
      }
      
      return { success: false, error: 'لم يتم اكتشاف أي رمز' };
    } catch (error) {
      console.error('[ScannerOperationsService] خطأ في عملية المسح:', error);
      this.isScanning = false;
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف في عملية المسح'
      };
    }
  }
  
  /**
   * إيقاف عملية المسح الجارية
   */
  public async stopScan(): Promise<boolean> {
    try {
      console.log('[ScannerOperationsService] إيقاف عملية المسح');
      
      if (!this.isScanning) {
        console.log('[ScannerOperationsService] لا توجد عملية مسح نشطة');
        return true;
      }
      
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // إيقاف تشغيل الفلاش أولاً
        await BarcodeScanner.enableTorch(false).catch(() => {});
        
        // استدعاء stopScan بدون معاملات
        await BarcodeScanner.stopScan();
      }
      
      this.isScanning = false;
      return true;
    } catch (error) {
      console.error('[ScannerOperationsService] خطأ في إيقاف المسح:', error);
      this.isScanning = false;
      return false;
    }
  }
}

// تصدير مثيل وحيد من الخدمة
export const scannerOperationsService = ScannerOperationsService.getInstance();
