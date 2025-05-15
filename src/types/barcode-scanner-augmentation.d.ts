
import '@capacitor-mlkit/barcode-scanning';

declare module '@capacitor-mlkit/barcode-scanning' {
  interface BarcodeScannerPlugin {
    showBackground(): Promise<void>;
    hideBackground(): Promise<void>;
    prepare(): Promise<void>;
    stopScan(): Promise<void>; // Ensure this is defined correctly with no parameters
  }
}
