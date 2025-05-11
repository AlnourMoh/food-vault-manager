
/**
 * واجهات وأنواع خدمات الأذونات
 */

export interface PermissionStatus {
  camera: 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied';
}

export interface PermissionResult {
  isGranted: boolean;
  isDenied: boolean;
}

export interface IPermissionHandler {
  checkPermission(): Promise<PermissionResult>;
  requestPermission(): Promise<boolean>;
  isAvailable(): boolean;
}
