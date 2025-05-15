
import '@capacitor-mlkit/barcode-scanning';

declare module '@capacitor-mlkit/barcode-scanning' {
  interface BarcodeScannerPlugin {
    showBackground(): Promise<void>;
    hideBackground(): Promise<void>;
    prepare(): Promise<void>;
  }
}
