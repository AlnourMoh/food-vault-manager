
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { scannerPermissionService } from './ScannerPermissionService';
import '@/types/barcode-scanner-augmentation.d.ts';

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
   * بدء عملية المسح
   */
  public async startScan(): Promise<boolean> {
    try {
      console.log('[BarcodeScannerService] بدء المسح');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('[BarcodeScannerService] ليست منصة أصلية');
        return false;
      }
      
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[BarcodeScannerService] ملحق MLKit غير متوفر');
        return false;
      }
      
      // التحقق من الإذن
      const permission = await scannerPermissionService.checkPermission();
      if (!permission) {
        console.log('[BarcodeScannerService] طلب إذن الكاميرا');
        const granted = await scannerPermissionService.requestPermission();
        if (!granted) {
          console.log('[BarcodeScannerService] تم رفض طلب الإذن');
          await Toast.show({
            text: 'يجب منح إذن الكاميرا لاستخدام الماسح',
            duration: 'long'
          });
          return false;
        }
      }
      
      // تهيئة الماسح
      try {
        console.log('[BarcodeScannerService] تحضير الماسح');
        await BarcodeScanner.prepare();
      } catch (error) {
        console.error('[BarcodeScannerService] خطأ في تحضير الماسح:', error);
      }
      
      // إظهار خلفية الماسح
      try {
        console.log('[BarcodeScannerService] إظهار خلفية الماسح');
        await BarcodeScanner.showBackground();
      } catch (error) {
        console.error('[BarcodeScannerService] خطأ في إظهار خلفية الماسح:', error);
      }
      
      // بدء المسح
      console.log('[BarcodeScannerService] بدء مسح الباركود');
      const result = await BarcodeScanner.scan();
      
      console.log('[BarcodeScannerService] نتيجة المسح:', result);
      
      if (result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue;
        if (code) {
          await Toast.show({
            text: `تم مسح الرمز: ${code}`,
            duration: 'short'
          });
          
          // هنا يمكن إضافة معالج النتيجة
          
          // إخفاء خلفية الماسح بعد المسح
          try {
            await BarcodeScanner.hideBackground();
          } catch (error) {
            console.error('[BarcodeScannerService] خطأ في إخفاء خلفية الماسح:', error);
          }
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('[BarcodeScannerService] خطأ في المسح:', error);
      return false;
    }
  }

  /**
   * إيقاف عملية المسح
   */
  public async stopScan(): Promise<void> {
    try {
      console.log('[BarcodeScannerService] إيقاف المسح');
      
      if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        return;
      }
      
      // إيقاف الفلاش أولاً
      await BarcodeScanner.enableTorch({ enable: false }).catch(() => {});
      
      // إخفاء خلفية الماسح
      try {
        await BarcodeScanner.hideBackground();
      } catch (error) {
        console.error('[BarcodeScannerService] خطأ في إخفاء خلفية الماسح:', error);
      }
      
      // إيقاف المسح
      await BarcodeScanner.stopScan();
      
      console.log('[BarcodeScannerService] تم إيقاف المسح');
    } catch (error) {
      console.error('[BarcodeScannerService] خطأ في إيقاف المسح:', error);
    }
  }
}

// تصدير مثيل واحد من الخدمة
export const barcodeScannerService = BarcodeScannerService.getInstance();
