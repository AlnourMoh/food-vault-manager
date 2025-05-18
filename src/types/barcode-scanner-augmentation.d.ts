
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

// إضافة الدوال الناقصة إلى واجهة برمجة التطبيقات
declare module '@capacitor-mlkit/barcode-scanning' {
  interface BarcodeScannerPlugin {
    showBackground(): Promise<void>;
    hideBackground(): Promise<void>;
    prepare(): Promise<void>;
    isTorchEnabled(): Promise<{ enabled: boolean }>;
    enableTorch(options: { enable: boolean }): Promise<void>;
  }
}

export {};
