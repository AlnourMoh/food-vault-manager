
// تعريفات لتوسيع وظائف الماسح الضوئي وخصوصًا BarcodeDetector

// تعريف التنسيقات المدعومة للباركود
export type BarcodeFormat = 
  | "qr_code"
  | "upc_a"
  | "upc_e"
  | "ean_8"
  | "ean_13"
  | "code_39"
  | "code_93"
  | "code_128"
  | "itf"
  | "codabar"
  | "data_matrix"
  | "aztec"
  | "pdf417";

// ثوابت التنسيقات للباركود للاستخدام السهل
export const BarcodeFormat = {
  QrCode: "qr_code" as BarcodeFormat,
  UpcA: "upc_a" as BarcodeFormat,
  UpcE: "upc_e" as BarcodeFormat,
  Ean8: "ean_8" as BarcodeFormat,
  Ean13: "ean_13" as BarcodeFormat,
  Code39: "code_39" as BarcodeFormat,
  Code93: "code_93" as BarcodeFormat,
  Code128: "code_128" as BarcodeFormat,
  Itf: "itf" as BarcodeFormat,
  Codabar: "codabar" as BarcodeFormat,
  DataMatrix: "data_matrix" as BarcodeFormat,
  Aztec: "aztec" as BarcodeFormat,
  Pdf417: "pdf417" as BarcodeFormat
};

// تعريف اتجاه الكاميرا
export type LensFacing = "front" | "back";

// ثوابت اتجاه الكاميرا للاستخدام السهل
export const LensFacing = {
  Front: "front" as LensFacing,
  Back: "back" as LensFacing
};

// تعريف نتيجة الكشف عن الباركود
export interface BarcodeDetectorResult {
  boundingBox: DOMRectReadOnly;
  cornerPoints: ReadonlyArray<{x: number, y: number}>;
  format: BarcodeFormat;
  rawValue: string;
}

// تعريف خيارات الكاشف
export interface BarcodeDetectorOptions {
  formats: Array<BarcodeFormat>;
}

// تعريف BarcodeDetector لبيئة الويب
export class BarcodeDetector {
  constructor(options?: BarcodeDetectorOptions);
  static getSupportedFormats(): Promise<Array<BarcodeFormat>>;
  detect(image: ImageBitmapSource): Promise<Array<BarcodeDetectorResult>>;
}

// تعريف نوع المستمعين والأحداث
export interface BarcodeScanListener {
  (result: { barcodes: Array<{ rawValue: string, format?: string }> }): void;
}

// إضافة توسعة لواجهة الباركود سكانر من MLKit
export interface BarcodeScannerPlugin {
  // الوظائف الأصلية
  scan(options?: { formats?: string[] }): Promise<{ barcodes: Array<{ rawValue: string }> }>;
  checkPermissions(): Promise<{ camera: 'granted' | 'denied' | 'prompt' }>;
  requestPermissions(): Promise<{ camera: 'granted' | 'denied' | 'prompt' }>;
  
  // إضافة وظائف معالجة المستمعين
  addListener(eventName: string, listenerFunc: BarcodeScanListener): Promise<{ remove: () => Promise<void> }>;
  removeAllListeners(): Promise<void>;
  
  // إضافة وظائف الماسح
  startScan(options?: { formats?: BarcodeFormat[], lensFacing?: LensFacing }): Promise<void>;
  stopScan(): Promise<void>;
  
  // إضافة وظائف الإعداد والتهيئة
  prepare(): Promise<void>;
  isSupported(): Promise<{ supported: boolean }>;
  openSettings(): Promise<void>;
  
  // إضافة وظائف الخلفية والواجهة
  hideBackground(): Promise<void>;
  showBackground(): Promise<void>;
  
  // إضافة وظائف الإضاءة
  enableTorch(): Promise<void>;
  disableTorch(): Promise<void>;
  toggleTorch(): Promise<void>;
  isTorchAvailable(): Promise<{ available: boolean }>;
}

// إعلان عن وجود BarcodeScanner في الحزمة
declare module '@capacitor-mlkit/barcode-scanning' {
  export const BarcodeScanner: BarcodeScannerPlugin;
  export { BarcodeFormat, LensFacing };
}
