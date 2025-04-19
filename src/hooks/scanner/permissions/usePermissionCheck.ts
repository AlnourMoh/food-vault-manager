
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Camera } from '@capacitor/camera';

export const usePermissionCheck = () => {
  const checkBarcodePermission = async () => {
    if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
      const status = await BarcodeScanner.checkPermission({ force: false });
      return {
        granted: status.granted,
        neverAsked: status.neverAsked
      };
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
