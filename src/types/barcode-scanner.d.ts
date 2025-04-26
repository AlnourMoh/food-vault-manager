
import { Plugin, PluginListenerHandle } from '@capacitor/core';

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

export type PermissionState = 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied';

export interface BarcodeScannerPlugin extends Plugin {
  isSupported(): Promise<{ supported: boolean }>;
  checkPermissions(): Promise<{ camera: PermissionState }>;
  requestPermissions(): Promise<{ camera: PermissionState }>;
  scan(options?: ScanOptions): Promise<ScanResult>;
  enableTorch(): Promise<void>;
  disableTorch(): Promise<void>;
  startScan(options?: StartScanOptions): Promise<void>;
  stopScan(): Promise<void>;
  addListener(eventName: 'barcodesScanned', listenerFunc: (event: BarcodesScannedEvent) => void): Promise<PluginListenerHandle>;
  addListener(eventName: 'scanError', listenerFunc: (event: ScanErrorEvent) => void): Promise<PluginListenerHandle>;
  addListener(eventName: 'googleBarcodeScannerModuleInstallProgress', listenerFunc: (event: GoogleBarcodeScannerModuleInstallProgressEvent) => void): Promise<PluginListenerHandle>;
}

export interface ScanOptions {
  formats?: BarcodeFormat[];
}

export interface StartScanOptions {
  formats?: BarcodeFormat[];
}

export interface ScanResult {
  barcodes: BarcodeResult[];
}

export interface BarcodeResult {
  format: BarcodeFormat;
  rawValue: string;
  displayValue?: string;
  valueType?: 'TEXT' | 'URL' | 'PRODUCT' | 'ISBN' | 'CONTACT' | 'EMAIL' | 'PHONE' | 'SMS' | 'WIFI' | 'GEO' | 'CALENDAR' | 'UNKNOWN';
  cornerPoints?: Point[];
}

interface Point {
  x: number;
  y: number;
}

// Add the event interfaces
export interface BarcodesScannedEvent {
  barcodes: BarcodeResult[];
}

export interface ScanErrorEvent {
  error: string;
}

export interface GoogleBarcodeScannerModuleInstallProgressEvent {
  state: 'downloading' | 'installing';
  progress: number;
}
