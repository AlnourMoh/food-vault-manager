
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
