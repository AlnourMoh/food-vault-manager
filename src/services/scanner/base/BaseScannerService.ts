
/**
 * الخدمة الأساسية للماسح الضوئي
 * يتم توريثها من قبل خدمات الماسح المحددة
 */

import { ZXingScannerOptions, ZXingScanResult } from '@/types/zxing-scanner';

export interface ScannerService {
  isSupported(): Promise<boolean>;
  requestPermission(): Promise<{ granted: boolean; error?: string }>;
  startScan(options: ZXingScannerOptions, onScan: (result: ZXingScanResult) => void): Promise<boolean>;
  stopScan(): Promise<void>;
  scanFromImage(imageSource: string | Blob | File): Promise<ZXingScanResult | null>;
  dispose(): void;
}

/**
 * الخدمة الأساسية التي تحتوي على المنطق المشترك بين خدمات الماسح
 */
export abstract class BaseScannerService implements ScannerService {
  protected hasPermission: boolean = false;
  protected isScanning: boolean = false;
  
  /**
   * التحقق من دعم الجهاز للماسح
   */
  abstract isSupported(): Promise<boolean>;
  
  /**
   * طلب إذن الكاميرا
   */
  abstract requestPermission(): Promise<{ granted: boolean; error?: string }>;
  
  /**
   * بدء عملية المسح
   */
  abstract startScan(options: ZXingScannerOptions, onScan: (result: ZXingScanResult) => void): Promise<boolean>;
  
  /**
   * إيقاف عملية المسح
   */
  abstract stopScan(): Promise<void>;
  
  /**
   * مسح الباركود من صورة
   */
  abstract scanFromImage(imageSource: string | Blob | File): Promise<ZXingScanResult | null>;
  
  /**
   * تنظيف الموارد
   */
  abstract dispose(): void;
}
