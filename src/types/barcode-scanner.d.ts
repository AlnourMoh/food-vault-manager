
import { Plugin } from '@capacitor/core';

declare global {
  interface Window {
    Capacitor?: {
      isPluginAvailable: (name: string) => boolean;
      getPlatform: () => string;
    };
  }
}

export enum SupportedFormat {
  QR_CODE = "QR_CODE",
  UPC_E = "UPC_E",
  UPC_A = "UPC_A",
  EAN_8 = "EAN_8",
  EAN_13 = "EAN_13",
  CODE_39 = "CODE_39",
  CODE_93 = "CODE_93",
  CODE_128 = "CODE_128",
  CODABAR = "CODABAR",
  ITF = "ITF",
  AZTEC = "AZTEC",
  DATA_MATRIX = "DATA_MATRIX",
  PDF_417 = "PDF_417"
}

// Updated ScanOptions to match the library API
export interface ScanOptions {
  formats?: SupportedFormat[];
  lensFacing?: 'front' | 'back';
  detectionMode?: 'single' | 'continuous'; 
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
  enableTorch(): Promise<void>;  // Updated to match the API
  disableTorch(): Promise<void>;
  prepare(): Promise<void>;
  showBackground(): Promise<void>;
  hideBackground(): Promise<void>;
}
