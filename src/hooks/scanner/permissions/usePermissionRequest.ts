
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Camera } from '@capacitor/camera';
import { usePlatformPermissions } from './usePlatformPermissions';

export const usePermissionRequest = () => {
  const { toast } = useToast();
  const { handleIosPermissions, handleAndroidPermissions, handleWebPermissions } = usePlatformPermissions();

  const requestPermission = async (force = true) => {
    try {
      console.log(`requestPermission called with force=${force}, checking platform...`);
      const platform = window.Capacitor?.getPlatform();
      console.log('Current platform:', platform);

      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        console.log(`Requesting BarcodeScanner permission with force=${force}...`);
        // Force showing the permission dialog by setting force parameter
        const result = await BarcodeScanner.checkPermission({ force });
        console.log('BarcodeScanner permission result:', result);
        const granted = result.granted;

        if (!granted) {
          console.log('Permission not granted, handling based on platform');
          if (platform === 'ios') {
            return handleIosPermissions();
          } else if (platform === 'android') {
            return handleAndroidPermissions();
          }
        }

        console.log('Permission granted or not platform-specific:', granted);
        return granted;
      } else if (window.Capacitor?.isPluginAvailable('Camera')) {
        console.log('BarcodeScanner not available, trying Camera plugin...');
        // Try the Camera plugin if BarcodeScanner is not available
        const result = await Camera.requestPermissions({
          permissions: ['camera']
        });
        console.log('Camera permission result:', result);
        return result.camera === 'granted';
      } else {
        console.log('Neither BarcodeScanner nor Camera available, using web fallback');
        // Web fallback
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
