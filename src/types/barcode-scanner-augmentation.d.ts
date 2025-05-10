
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
