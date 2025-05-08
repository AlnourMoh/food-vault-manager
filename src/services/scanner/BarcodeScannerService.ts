
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
   * فتح إعدادات التطبيق
   */
  public async openAppSettings(): Promise<boolean> {
    return await scannerPermissionService.openAppSettings();
  }
  
  /**
   * بدء مسح الباركود
   */
  public async startScan(): Promise<boolean> {
    try {
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        await Toast.show({
          text: 'هذا الجهاز لا يدعم مسح الباركود',
          duration: 'long'
        });
        return false;
      }
      
      // التحقق من الإذن أولاً
      const { camera } = await BarcodeScanner.checkPermissions();
      if (camera !== 'granted') {
        const granted = await this.requestPermission();
        if (!granted) {
          return false;
        }
      }
      
      // بدء المسح
      await BarcodeScanner.startScan();
      return true;
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

export const barcodeScannerService = BarcodeScannerService.getInstance();
