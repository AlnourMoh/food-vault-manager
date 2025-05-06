
import { Plugin } from '@capacitor/core';

declare global {
  interface Window {
    Capacitor?: {
      isPluginAvailable: (name: string) => boolean;
      getPlatform: () => string;
    };
  }
}

// We now use the BarcodeFormat enum directly from @capacitor-mlkit/barcode-scanning
// instead of our own SupportedFormat enum
import { BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';

// Updated ScanOptions to match the library API
export interface ScanOptions {
  formats?: BarcodeFormat[];
}

// Updated property name to match MLKit API
export interface IsSupportedResult {
  supported: boolean;
}

export interface IsTorchAvailableResult {
  available: boolean;
}

export interface ScanResult {
  hasContent: boolean;
  content: string;
  format?: string;
}

export type CameraDirection = 'front' | 'back';

export interface BarcodeScannerPlugin extends Plugin {
  startScan(options?: ScanOptions): Promise<ScanResult>;
  stopScan(): Promise<void>;
  checkPermission(): Promise<{ granted: boolean }>;
  requestPermission(): Promise<{ granted: boolean }>;
  openSettings(): Promise<void>;
  toggleTorch(): Promise<void>;
  enableTorch(): Promise<void>;
  disableTorch(): Promise<void>;
  prepare(): Promise<void>;
  showBackground(): Promise<void>;
  hideBackground(): Promise<void>;
  isSupported(): Promise<IsSupportedResult>;
  isTorchAvailable(): Promise<IsTorchAvailableResult>;
}
