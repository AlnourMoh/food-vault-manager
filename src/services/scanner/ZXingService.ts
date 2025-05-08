
/**
 * خدمة الماسح الضوئي الرئيسية التي تستخدم نمط Singleton
 */

import { ZXingScannerOptions, ZXingScanResult } from '@/types/zxing-scanner';
import { ZXingImplementation } from './zxing/ZXingImplementation';
import { ScannerService } from './base/BaseScannerService';

/**
 * خدمة الماسح الضوئي باستخدام مكتبة ZXing
 * تستخدم نمط Singleton للحصول على مثيل واحد من الخدمة
 */
export class ZXingService implements ScannerService {
  private static instance: ZXingService;
  private implementation: ZXingImplementation;
  
  private constructor() {
    this.implementation = new ZXingImplementation();
  }
  
  /**
   * الحصول على مثيل الخدمة
   */
  public static getInstance(): ZXingService {
    if (!ZXingService.instance) {
      ZXingService.instance = new ZXingService();
    }
    return ZXingService.instance;
  }
  
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    return this.implementation.isSupported();
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<{ granted: boolean; error?: string }> {
    return this.implementation.requestPermission();
  }
  
  /**
   * بدء عملية المسح
   */
  public async startScan(options: ZXingScannerOptions = {}, onScan: (result: ZXingScanResult) => void): Promise<boolean> {
    return this.implementation.startScan(options, onScan);
  }
  
  /**
   * إيقاف عملية المسح
   */
  public async stopScan(): Promise<void> {
    return this.implementation.stopScan();
  }
  
  /**
   * مسح الباركود من صورة
   */
  public async scanFromImage(imageSource: string | Blob | File): Promise<ZXingScanResult | null> {
    return this.implementation.scanFromImage(imageSource);
  }
  
  /**
   * تنظيف الموارد
   */
  public dispose(): void {
    this.implementation.dispose();
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const zxingService = ZXingService.getInstance();
