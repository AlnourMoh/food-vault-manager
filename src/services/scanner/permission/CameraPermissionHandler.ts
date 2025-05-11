
import { Camera } from '@capacitor/camera';
import { IPermissionHandler, PermissionResult } from './types';
import { Toast } from '@capacitor/toast';

/**
 * معالج أذونات الكاميرا باستخدام ملحق الكاميرا الأساسي
 */
export class CameraPermissionHandler implements IPermissionHandler {
  private pluginName = 'Camera';
  
  public isAvailable(): boolean {
    return window.Capacitor?.isPluginAvailable(this.pluginName) || false;
  }

  public async checkPermission(): Promise<PermissionResult> {
    try {
      console.log('[CameraPermissionHandler] فحص أذونات الكاميرا الأساسية');
      const { camera } = await Camera.checkPermissions();
      const isGranted = camera === 'granted';
      console.log('[CameraPermissionHandler] نتيجة فحص Camera:', isGranted ? 'ممنوح' : 'غير ممنوح');
      
      return {
        isGranted,
        isDenied: camera === 'denied'
      };
    } catch (error) {
      console.error('[CameraPermissionHandler] خطأ في التحقق من أذونات الكاميرا:', error);
      return { isGranted: false, isDenied: false };
    }
  }

  public async requestPermission(): Promise<boolean> {
    try {
      console.log('[CameraPermissionHandler] طلب إذن الكاميرا الأساسية');
      
      await Toast.show({
        text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
        duration: 'short'
      });
      
      const result = await Camera.requestPermissions({ permissions: ['camera'] });
      const granted = result.camera === 'granted';
      console.log('[CameraPermissionHandler] نتيجة طلب أذونات الكاميرا:', granted ? 'ممنوح' : 'مرفوض');
      
      return granted;
    } catch (error) {
      console.error('[CameraPermissionHandler] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
}
