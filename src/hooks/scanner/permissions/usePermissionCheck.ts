
import { BarcodeScanning } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';

export const usePermissionCheck = () => {
  const checkBarcodePermission = async () => {
    if (window.Capacitor) {
      try {
        const status = await BarcodeScanning.checkPermissions();
        return {
          granted: status.granted,
          neverAsked: false
        };
      } catch (error) {
        console.error('خطأ في التحقق من إذن الماسح:', error);
        return null;
      }
    }
    return null;
  };

  const checkCameraPermission = async () => {
    if (window.Capacitor?.isPluginAvailable('Camera')) {
      const { camera } = await Camera.checkPermissions();
      return {
        granted: camera === 'granted'
      };
    }
    return null;
  };

  return {
    checkBarcodePermission,
    checkCameraPermission
  };
};
