
// تعريفات لتوسيع وظائف الماسح الضوئي وخصوصًا BarcodeDetector

// تعريف التنسيقات المدعومة للباركود
export enum BarcodeFormat {
  QrCode = "qr_code",
  UpcA = "upc_a",
  UpcE = "upc_e",
  Ean8 = "ean_8",
  Ean13 = "ean_13",
  Code39 = "code_39",
  Code93 = "code_93",
  Code128 = "code_128",
  Itf = "itf",
  Codabar = "codabar",
  DataMatrix = "data_matrix",
  Aztec = "aztec",
  Pdf417 = "pdf417"
}

// تعريف اتجاه الكاميرا
export enum LensFacing {
  Front = "front",
  Back = "back"
}

// تعريف نتيجة الكشف عن الباركود
export interface BarcodeDetectorResult {
  boundingBox: DOMRectReadOnly;
  cornerPoints: ReadonlyArray<{x: number, y: number}>;
  format: BarcodeFormat;
  rawValue: string;
}

// تعريف خيارات الكاشف
export interface BarcodeDetectorOptions {
  formats: Array<BarcodeFormat | string>;
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
