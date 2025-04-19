
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Camera } from '@capacitor/camera';
import { usePlatformPermissions } from './usePlatformPermissions';

export const usePermissionRequest = () => {
  const { toast } = useToast();
  const { handleIosPermissions, handleAndroidPermissions, handleWebPermissions } = usePlatformPermissions();

  const requestPermission = async () => {
    try {
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        console.log('Requesting BarcodeScanner permission...');
        const result = await BarcodeScanner.checkPermission({ force: true });
        const granted = result.granted;

        if (!granted) {
          if (window.Capacitor.getPlatform() === 'ios') {
            return handleIosPermissions();
          } else if (window.Capacitor.getPlatform() === 'android') {
            return handleAndroidPermissions();
          }
        }

        return granted;
      } else if (window.Capacitor?.isPluginAvailable('Camera')) {
        console.log('Requesting Camera permission...');
        const result = await Camera.requestPermissions({
          permissions: ['camera']
        });
        return result.camera === 'granted';
      } else {
        return handleWebPermissions();
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء طلب إذن الكاميرا",
        variant: "destructive"
      });
      return false;
    }
  };

  return { requestPermission };
};
