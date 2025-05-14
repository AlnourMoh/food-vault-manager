
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { scannerPermissionService } from './ScannerPermissionService';

/**
 * خدمة الماسح الضوئي للباركود
 */
class BarcodeScannerService {
  private static instance: BarcodeScannerService;
  
  private constructor() {}
  
  public static getInstance(): BarcodeScannerService {
    if (!BarcodeScannerService.instance) {
      BarcodeScannerService.instance = new BarcodeScannerService();
    }
    return BarcodeScannerService.instance;
  }
  
  /**
   * التحقق مما إذا كان الجهاز يدعم مسح الباركود
   */
  public async isSupported(): Promise<boolean> {
    try {
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const result = await BarcodeScanner.isSupported();
        return result.supported;
      }
      return false;
    } catch (error) {
      console.error('[BarcodeScannerService] خطأ في التحقق من الدعم:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      // استخدام خدمة الأذونات للحصول على إذن الكاميرا
      return await scannerPermissionService.requestPermission();
    } catch (error) {
      console.error('[BarcodeScannerService] خطأ في طلب الإذن:', error);
      return false;
    }
  }
  
  /**
   * بدء المسح
   */
  public async startScan(): Promise<boolean> {
    try {
      // التحقق من دعم الماسح
      const isSupported = await this.isSupported();
      if (!isSupported) {
        console.log('[BarcodeScannerService] الماسح غير مدعوم على هذا الجهاز');
        await Toast.show({
          text: 'هذا الجهاز لا يدعم ماسح الباركود',
          duration: 'long'
        });
        return false;
      }
      
      // التحقق من إذن الكاميرا
      const hasPermission = await scannerPermissionService.checkPermission();
      if (!hasPermission) {
        console.log('[BarcodeScannerService] لا يوجد إذن للكاميرا، محاولة طلبه...');
        
        const permissionGranted = await this.requestPermission();
        if (!permissionGranted) {
          console.log('[BarcodeScannerService] تم رفض إذن الكاميرا');
          await Toast.show({
            text: 'تم رفض إذن الكاميرا. لا يمكن استخدام الماسح الضوئي بدون هذا الإذن.',
            duration: 'long'
          });
          return false;
        }
      }
      
      // بدء المسح
      const result = await BarcodeScanner.scan();
      
      // التحقق من النتيجة
      if (result.barcodes && result.barcodes.length > 0) {
        console.log('[BarcodeScannerService] تم مسح الباركود:', result.barcodes);
        
        // يمكن إضافة معالجة إضافية هنا
        
        return true;
      } else {
        console.log('[BarcodeScannerService] لم يتم العثور على باركود');
        return false;
      }
    } catch (error) {
      console.error('[BarcodeScannerService] خطأ في بدء المسح:', error);
      return false;
    }
  }
  
  /**
   * إيقاف المسح
   */
  public async stopScan(): Promise<void> {
    if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
      try {
        await BarcodeScanner.stopScan();
      } catch (error) {
        console.error('[BarcodeScannerService] خطأ في إيقاف المسح:', error);
      }
    }
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const barcodeScannerService = BarcodeScannerService.getInstance();
