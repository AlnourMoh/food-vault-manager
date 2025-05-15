
import '@capacitor-mlkit/barcode-scanning';

// اضافة تعريفات مخصصة للتعامل مع الملحق
declare module '@capacitor-mlkit/barcode-scanning' {
  interface BarcodeScanner {
    /**
     * تعريف دالة stopScan التي لا تأخذ معاملات
     */
    stopScan(): Promise<void>;
    
    /**
     * تعريف دالة disableTorch التي لا تأخذ معاملات
     */
    disableTorch(): Promise<void>;
  }
}
