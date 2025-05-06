
import { scannerPermissionService } from './ScannerPermissionService';
import { scannerUIService } from './ScannerUIService';
import { scannerOperationsService } from './ScannerOperationsService';

/**
 * واجهة موحدة للتعامل مع ماسح الباركود
 * تجمع كل الخدمات المتخصصة في واجهة واحدة
 */
export class BarcodeScannerService {
  private static instance: BarcodeScannerService;
  
  private constructor() {}
  
  public static getInstance(): BarcodeScannerService {
    if (!BarcodeScannerService.instance) {
      BarcodeScannerService.instance = new BarcodeScannerService();
    }
    return BarcodeScannerService.instance;
  }
  
  // خدمات الأذونات
  
  /**
   * فتح إعدادات التطبيق
   */
  public async openAppSettings(): Promise<void> {
    return scannerPermissionService.openAppSettings();
  }
  
  /**
   * التحقق مما إذا كان الماسح مدعومًا على الجهاز
   */
  public async isSupported(): Promise<boolean> {
    return scannerPermissionService.isSupported();
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    return scannerPermissionService.requestPermission();
  }
  
  /**
   * التحقق من حالة إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    return scannerPermissionService.checkPermission();
  }
  
  // خدمات المسح
  
  /**
   * فحص وإعداد كل ما هو مطلوب قبل بدء المسح
   */
  public async prepareScanner(): Promise<boolean> {
    return scannerOperationsService.prepareScanner();
  }
  
  /**
   * بدء عملية المسح
   */
  public async startScan(onSuccess: (code: string) => void): Promise<boolean> {
    return scannerOperationsService.startScan(onSuccess);
  }
  
  /**
   * إيقاف عملية المسح وتنظيف الموارد
   */
  public async stopScan(): Promise<void> {
    return scannerOperationsService.stopScan();
  }
  
  /**
   * تنظيف الموارد والإعدادات
   */
  public cleanup(): void {
    scannerUIService.cleanup();
    this.stopScan().catch(e => 
      console.error('[BarcodeScannerService] خطأ في تنظيف الموارد:', e)
    );
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const barcodeScannerService = BarcodeScannerService.getInstance();
