
import { IPermissionHandler, PermissionResult } from './types';

/**
 * معالج وهمي للمحاكاة وبيئة التطوير
 */
export class MockPermissionHandler implements IPermissionHandler {
  public isAvailable(): boolean {
    return true;
  }

  public async checkPermission(): Promise<PermissionResult> {
    console.log('[MockPermissionHandler] محاكاة فحص الأذونات - دائمًا مسموح');
    return { isGranted: true, isDenied: false };
  }

  public async requestPermission(): Promise<boolean> {
    console.log('[MockPermissionHandler] محاكاة طلب الأذونات - دائمًا مسموح');
    return true;
  }
}
