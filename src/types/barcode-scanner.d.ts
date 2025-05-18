
import { Plugin } from '@capacitor/core';
import { BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';

declare global {
  interface Window {
    Capacitor?: {
      isPluginAvailable: (name: string) => boolean;
      getPlatform: () => string;
    };
  }
}

// تحديث ScanOptions ليتوافق مع واجهة التطبيق
export interface ScanOptions {
  formats?: BarcodeFormat[];
}

export interface IsSupportedResult {
  supported: boolean;
}

export interface IsTorchAvailableResult {
  available: boolean;
}

export interface ScanResult {
  hasContent: boolean;
  content: string;
  format?: string;
}

export type CameraDirection = 'front' | 'back';

export interface BarcodeScannerPlugin extends Plugin {
  /**
   * تحضير الماسح الضوئي للاستخدام
   * @returns وعد بنتيجة التحضير
   */
  prepare(): Promise<void>;
  
  /**
   * بدء عملية المسح الضوئي
   * @returns وعد بنتيجة المسح
   */
  startScan(): Promise<ScanResult>;
  
  /**
   * إيقاف عملية المسح الضوئي
   * @returns وعد بإتمام العملية
   */
  stopScan(): Promise<void>;
  
  /**
   * التحقق من أذونات الكاميرا
   * @returns وعد بنتيجة التحقق
   */
  checkPermission(): Promise<{ granted: boolean }>;
  
  /**
   * طلب أذونات الكاميرا
   * @returns وعد بنتيجة الطلب
   */
  requestPermission(): Promise<{ granted: boolean }>;
  
  /**
   * فتح إعدادات التطبيق
   * @returns وعد بإتمام العملية
   */
  openSettings(): Promise<void>;
  
  /**
   * تبديل حالة الفلاش
   * @returns وعد بإتمام العملية
   */
  toggleTorch(): Promise<void>;
  
  /**
   * تشغيل الفلاش
   * @returns وعد بإتمام العملية
   */
  enableTorch(): Promise<void>;
  
  /**
   * إيقاف الفلاش
   * @returns وعد بإتمام العملية
   */
  disableTorch(): Promise<void>;
  
  /**
   * إظهار خلفية الكاميرا
   * @returns وعد بإتمام العملية
   */
  showBackground(): Promise<void>;
  
  /**
   * إخفاء خلفية الكاميرا
   * @returns وعد بإتمام العملية
   */
  hideBackground(): Promise<void>;
  
  /**
   * التحقق من دعم الماسح الضوئي
   * @returns وعد بنتيجة التحقق
   */
  isSupported(): Promise<IsSupportedResult>;
  
  /**
   * التحقق من توفر الفلاش
   * @returns وعد بنتيجة التحقق
   */
  isTorchAvailable(): Promise<IsTorchAvailableResult>;
  
  /**
   * تمكين الكاميرا (للتوافق مع الإصدارات السابقة)
   * @returns وعد بإتمام العملية
   */
  enableCamera(): Promise<void>;
  
  /**
   * تعطيل الكاميرا (للتوافق مع الإصدارات السابقة)
   * @returns وعد بإتمام العملية
   */
  disableCamera(): Promise<void>;
  
  /**
   * مسح الباركود
   * @param options خيارات المسح
   * @returns وعد بنتيجة المسح
   */
  scan(options?: ScanOptions): Promise<{ barcodes: Array<{ rawValue: string }> }>;
  
  /**
   * التحقق من أذونات الكاميرا
   * @returns وعد بحالة الأذونات
   */
  checkPermissions(): Promise<{ camera: 'granted' | 'denied' | 'prompt' }>;
  
  /**
   * طلب أذونات الكاميرا
   * @returns وعد بحالة الأذونات
   */
  requestPermissions(): Promise<{ camera: 'granted' | 'denied' | 'prompt' }>;
}

// تعريف واضح لاستخدام BarcodeScanner من المكتبة
declare module '@capacitor-mlkit/barcode-scanning' {
  const BarcodeScanner: BarcodeScannerPlugin;
  export { BarcodeScanner, BarcodeFormat };
}
