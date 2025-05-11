
import { IPermissionHandler, PermissionResult } from './types';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

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
      
      // إذا كنا في بيئة الويب، نتجنب استدعاء ملحق الكاميرا مباشرة
      if (!Capacitor.isNativePlatform()) {
        return { isGranted: true, isDenied: false };
      }
      
      // استخدام dynamic import لتجنب مشاكل الاستيراد
      if (this.isAvailable()) {
        const cameraModule = await import('@capacitor/camera');
        const { camera } = await cameraModule.Camera.checkPermissions();
        const isGranted = camera === 'granted';
        console.log('[CameraPermissionHandler] نتيجة فحص Camera:', isGranted ? 'ممنوح' : 'غير ممنوح');
        
        return {
          isGranted,
          isDenied: camera === 'denied'
        };
      }
      
      return { isGranted: false, isDenied: false };
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
      
      if (this.isAvailable()) {
        const cameraModule = await import('@capacitor/camera');
        const result = await cameraModule.Camera.requestPermissions({ permissions: ['camera'] });
        const granted = result.camera === 'granted';
        console.log('[CameraPermissionHandler] نتيجة طلب أذونات الكاميرا:', granted ? 'ممنوح' : 'مرفوض');
        
        return granted;
      }
      
      return false;
    } catch (error) {
      console.error('[CameraPermissionHandler] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
}
