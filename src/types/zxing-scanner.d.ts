
/**
 * تعريف الأنواع للماسح الضوئي ZXing
 */

// تعريف تنسيقات الباركود
export enum ZXingBarcodeFormat {
  QR_CODE = 'QR_CODE',
  EAN_13 = 'EAN_13',
  CODE_128 = 'CODE_128',
  CODE_39 = 'CODE_39',
  UPC_A = 'UPC_A',
  UPC_E = 'UPC_E',
  EAN_8 = 'EAN_8',
  DATA_MATRIX = 'DATA_MATRIX',
  PDF_417 = 'PDF_417',
  AZTEC = 'AZTEC',
  ITF = 'ITF'
}

// خيارات المسح
export interface ZXingScanOptions {
  formats?: ZXingBarcodeFormat[];
  cameraFacing?: 'front' | 'back';
  timeout?: number;
  tryHarder?: boolean;
  delayBetweenScanAttempts?: number;
  constraints?: MediaTrackConstraints;
}

// نتيجة المسح
export interface ZXingScanResult {
  text: string;
  format: ZXingBarcodeFormat;
  resultPoints?: Array<{ x: number; y: number }>;
  timestamp?: number;
  cancelled?: boolean;
}

// حالة إذن الكاميرا
export type PermissionStatus = 'granted' | 'denied' | 'prompt';

// مصفوفة لتحويل القيم النصية إلى قيم BarcodeFormat المستخدمة في MLKit
export const MLKitBarcodeFormatMap = {
  'QR_CODE': 1, // BarcodeFormat.QrCode
  'EAN_13': 32, // BarcodeFormat.Ean13
  'CODE_128': 1024, // BarcodeFormat.Code128
  'CODE_39': 4, // BarcodeFormat.Code39
  'UPC_A': 16, // BarcodeFormat.UpcA
  'UPC_E': 8, // BarcodeFormat.UpcE
  'EAN_8': 64, // BarcodeFormat.Ean8
  'DATA_MATRIX': 2, // BarcodeFormat.DataMatrix
  'PDF_417': 2048, // BarcodeFormat.Pdf417
  'AZTEC': 8192, // BarcodeFormat.Aztec
  'ITF': 128 // BarcodeFormat.Itf
};
