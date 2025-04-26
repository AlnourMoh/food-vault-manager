
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

export interface ScanOptions {
  targetedFormats?: SupportedFormat[];
  cameraDirection?: CameraDirection;
  showTorchButton?: boolean;
  showFlipCameraButton?: boolean;
  prompt?: string;
  formats?: string;
}

export interface ScanResult {
  hasContent: boolean;
  content: string;
  format?: string;
}

export type CameraDirection = 'front' | 'back';

/**
 * @deprecated Use `BarcodeScannerPlugin`.
 * @since 1.0.0
 */
export interface BarcodeScannerPlugin extends Plugin {
  /**
   * Starts scanning for barcodes.
   * @param options Camera scanning options
   */
  startScan(options?: ScanOptions): Promise<ScanResult>;
  
  /**
   * Stops scanning for barcodes.
   */
  stopScan(): Promise<void>;
  
  /**
   * Checks if scanning is supported.
   */
  checkPermission(): Promise<{ granted: boolean }>;
  
  /**
   * Requests permission to use the camera for scanning.
   */
  requestPermission(): Promise<{ granted: boolean }>;
  
  /**
   * Opens app settings so user can grant permissions.
   */
  openSettings(): Promise<void>;
  
  /**
   * Enable or disable the system torch (flashlight).
   */
  toggleTorch(): Promise<void>;
  
  /**
   * Check if torch is available on the device.
   */
  checkTorch(): Promise<{ available: boolean }>;
  
  /**
   * Prepare the scanner view with background transparency.
   */
  prepare(): Promise<void>;
  
  /**
   * Show camera preview and make app background transparent.
   */
  showBackground(): Promise<void>;
  
  /**
   * Hide camera preview and restore app background.
   */
  hideBackground(): Promise<void>;
}
