
import { Plugin } from '@capacitor/core';

declare global {
  interface Window {
    Capacitor?: {
      isPluginAvailable: (name: string) => boolean;
      getPlatform: () => string;
    };
  }
}

// استخدام BarcodeFormat مباشرة من مكتبة MLKit
import { BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';

// تحديث ScanOptions ليتوافق مع واجهة التطبيق
export interface ScanOptions {
  formats?: BarcodeFormat[];
}

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
  enableCamera(): Promise<void>; // Changed optional to required
  disableCamera(): Promise<void>; // Changed optional to required
}
