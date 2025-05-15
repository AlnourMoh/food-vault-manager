
// This file extends the BarcodeScanner type definitions to ensure proper TypeScript checking

import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

declare module '@capacitor-mlkit/barcode-scanning' {
  export interface BarcodeScanner {
    /**
     * Stop the current scan session. The version of the plugin's API requires no arguments.
     */
    stopScan(): Promise<void>;

    /**
     * Show background for scanner
     */
    showBackground(): Promise<void>;

    /**
     * Hide background for scanner
     */
    hideBackground(): Promise<void>;

    /**
     * Prepare the scanner
     */
    prepare(): Promise<void>;
  }
}

// Add global augmentation for Capacitor
declare global {
  interface Window {
    Capacitor?: {
      isPluginAvailable: (pluginName: string) => boolean;
      isNativePlatform: () => boolean;
      getPlatform: () => string;
    };
  }
}
