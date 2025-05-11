
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { IPermissionHandler, PermissionResult } from './types';
import { Toast } from '@capacitor/toast';

/**
 * معالج أذونات الكاميرا باستخدام MLKit
 */
export class MLKitPermissionHandler implements IPermissionHandler {
  private pluginName = 'MLKitBarcodeScanner';
  
  public isAvailable(): boolean {
    return window.Capacitor?.isPluginAvailable(this.pluginName) || false;
  }

  public async checkPermission(): Promise<PermissionResult> {
    try {
      console.log('[MLKitPermissionHandler] فحص أذونات BarcodeScanner');
      const { camera } = await BarcodeScanner.checkPermissions();
      const isGranted = camera === 'granted';
      console.log('[MLKitPermissionHandler] نتيجة فحص MLKit:', isGranted ? 'ممنوح' : 'غير ممنوح');
      
      return {
        isGranted,
        isDenied: camera === 'denied'
      };
    } catch (error) {
      console.error('[MLKitPermissionHandler] خطأ في التحقق من أذونات MLKit:', error);
      return { isGranted: false, isDenied: false };
    }
  }

  public async requestPermission(): Promise<boolean> {
    try {
      console.log('[MLKitPermissionHandler] طلب إذن MLKit');
      
      // عرض رسالة توضيحية
      await Toast.show({
        text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
        duration: 'short'
      });
      
      const result = await BarcodeScanner.requestPermissions();
      const granted = result.camera === 'granted';
      console.log('[MLKitPermissionHandler] نتيجة طلب أذونات MLKit:', granted ? 'ممنوح' : 'مرفوض');
      
      return granted;
    } catch (error) {
      console.error('[MLKitPermissionHandler] خطأ في طلب إذن MLKit:', error);
      return false;
    }
  }
}
