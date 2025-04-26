
import { Plugin } from '@capacitor/core';

declare global {
  interface Window {
    Capacitor?: {
      isPluginAvailable: (name: string) => boolean;
      getPlatform: () => string;
    };
  }
}

export enum BarcodeFormat {
  Aztec = 'AZTEC',
  Codabar = 'CODABAR',
  Code39 = 'CODE_39',
  Code93 = 'CODE_93',
  Code128 = 'CODE_128',
  DataMatrix = 'DATA_MATRIX',
  Ean8 = 'EAN_8',
  Ean13 = 'EAN_13',
  ITF = 'ITF',
  PDF417 = 'PDF_417',
  QrCode = 'QR_CODE',
  UPCA = 'UPC_A',
  UPCE = 'UPC_E',
}

export interface BarcodeScannerPlugin extends Plugin {
  isSupported(): Promise<{ supported: boolean }>;
  checkPermissions(): Promise<{ camera: PermissionState }>;
  requestPermissions(): Promise<{ camera: PermissionState }>;
  scan(options?: ScanOptions): Promise<ScanResult>;
  enableTorch(): Promise<void>;
  disableTorch(): Promise<void>;
  startScan(options?: StartScanOptions): Promise<void>;
  stopScan(): Promise<void>;
}

export interface ScanOptions {
  formats?: string[];
}

export interface StartScanOptions {
  formats?: BarcodeFormat[];
  continuous?: boolean;
  onScanComplete?: (result: ScanResult) => void;
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
