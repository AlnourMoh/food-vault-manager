
import { Plugin } from '@capacitor/core';

declare global {
  interface Window {
    Capacitor?: {
      isPluginAvailable: (name: string) => boolean;
      getPlatform: () => string;
    };
  }
}

export interface BarcodeScannerPlugin extends Plugin {
  isSupported(): Promise<{ supported: boolean }>;
  checkPermissions(): Promise<{ camera: PermissionState }>;
  requestPermissions(): Promise<{ camera: PermissionState }>;
  scan(options?: ScanOptions): Promise<ScanResult>;
  enableTorch(): Promise<void>;
}

export interface ScanOptions {
  formats?: string[];
}

export interface ScanResult {
  barcodes: BarcodeResult[];
}

export interface BarcodeResult {
  format: string;
  rawValue: string;
  displayValue?: string;
  valueType?: string;
  cornerPoints?: { x: number; y: number }[];
}
