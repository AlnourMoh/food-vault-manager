
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { MLKitScanResult } from './zxing-scanner';

// إضافة الدوال الناقصة إلى واجهة برمجة التطبيقات
declare module '@capacitor-mlkit/barcode-scanning' {
  interface BarcodeScannerPlugin {
    showBackground(): Promise<void>;
    hideBackground(): Promise<void>;
    prepare(): Promise<void>;
    isTorchEnabled(): Promise<{ enabled: boolean }>;
    enableTorch(options: { enable: boolean }): Promise<void>;
    startScan(): Promise<MLKitScanResult>; // تحديد نوع الإرجاع بوضوح
  }
}

export {};

