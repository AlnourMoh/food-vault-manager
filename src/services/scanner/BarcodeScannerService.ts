
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { scannerPermissionService } from './ScannerPermissionService';

/**
 * خدمة للتعامل مع ماسح الباركود
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
   * التحقق من دعم المسح
   */
  public async isSupported(): Promise<boolean> {
    try {
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        return false;
      }
      
      const result = await BarcodeScanner.isSupported();
      return result.supported;
    } catch (error) {
      console.error('[BarcodeScannerService] خطأ في التحقق من دعم المسح:', error);
      return false;
    }
  }
  
  /**
   * التحقق من إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    return scannerPermissionService.checkPermission();
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    return scannerPermissionService.requestPermission();
  }
  
  /**
   * فتح إعدادات التطبيق
   */
  public async openAppSettings(): Promise<boolean> {
    return await scannerPermissionService.openAppSettings();
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
  public async stopScan(): Promise<boolean> {
    try {
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[BarcodeScannerService] إيقاف المسح...');
        
        // إيقاف الفلاش إذا كان مفعلاً
        await BarcodeScanner.enableTorch(false).catch(() => {});
        
        // Fixed: Remove the argument from stopScan()
        await BarcodeScanner.stopScan();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[BarcodeScannerService] خطأ في إيقاف المسح:', error);
      return false;
    }
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const barcodeScannerService = BarcodeScannerService.getInstance();
