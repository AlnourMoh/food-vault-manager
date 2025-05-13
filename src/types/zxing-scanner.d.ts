
/**
 * تعريفات الأنواع الخاصة بمكتبة ZXing للماسح الضوئي
 */

import { BarcodeFormat, DecodeHintType } from '@zxing/library';

export interface ZXingScannerOptions {
  formats?: BarcodeFormat[];
  hints?: Map<DecodeHintType, any>;
  tryHarder?: boolean;
  delayBetweenScanAttempts?: number;
  constraints?: MediaTrackConstraints;
}

export interface ZXingScanResult {
  text: string;
  format?: BarcodeFormat;
  resultPoints?: Array<{ x: number; y: number }>;
  timestamp?: number;
  rawBytes?: Uint8Array;
}

export interface ZXingPermissionStatus {
  granted: boolean;
  error?: string;
}

export interface ZXingDeviceInfo {
  deviceId: string;
  label: string;
  groupId?: string;
}

export interface ZXingCameraCapabilities {
  hasFlash: boolean;
  availableDevices: ZXingDeviceInfo[];
}

/**
 * قيم تنسيقات الباركود المستخدمة في MLKit
 * 
 * QR_CODE = 1
 * AZTEC = 2
 * CODABAR = 4
 * CODE_39 = 16
 * CODE_93 = 32
 * CODE_128 = 64
 * DATA_MATRIX = 128
 * EAN_8 = 256
 * EAN_13 = 32
 * ITF = 128
 * PDF_417 = 2
 * UPC_A = 512
 * UPC_E = 1024
 */
