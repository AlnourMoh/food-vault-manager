
import { BarcodeFormat, BarcodeScannerPlugin } from './barcode-scanner';

// Extend the existing BarcodeScanner interface from @capacitor-mlkit/barcode-scanning
declare module '@capacitor-mlkit/barcode-scanning' {
  interface BarcodeScannerPlugin {
    /**
     * تحضير الماسح الضوئي للاستخدام
     */
    prepare(): Promise<void>;
    
    /**
     * إظهار خلفية الكاميرا
     */
    showBackground(): Promise<void>;
    
    /**
     * إخفاء خلفية الكاميرا
     */
    hideBackground(): Promise<void>;
  }
}
