
import { useToast } from '@/hooks/use-toast';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { Toast } from '@capacitor/toast';

export const usePermissionRequest = (permissionStatus: any) => {
  const { setIsLoading, setHasPermission } = permissionStatus;
  const { toast } = useToast();

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      if (!Capacitor.isNativePlatform()) {
        toast({
          title: "Not Supported",
          description: "Camera permissions are not supported in browser",
          variant: "destructive"
        });
        return false;
      }

      // Show explanatory message
      await Toast.show({
        text: 'The app needs camera permission for barcode scanning',
        duration: 'short'
      });

      // Try MLKit first
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const result = await BarcodeScanner.requestPermissions();
        const granted = result.camera === 'granted';
        
        setHasPermission(granted);
        
        if (granted) {
          await Toast.show({
            text: 'Camera permission granted successfully!',
            duration: 'short'
          });
        }
        
        return granted;
      }

      // Fallback to Camera plugin
      if (Capacitor.isPluginAvailable('Camera')) {
        const result = await Camera.requestPermissions();
        const granted = result.camera === 'granted';
        
        setHasPermission(granted);
        
        if (granted) {
          await Toast.show({
            text: 'Camera permission granted successfully!',
            duration: 'short'
          });
        }
        
        return granted;
      }

      toast({
        title: "Error",
        description: "No camera plugin available",
        variant: "destructive"
      });
      
      return false;
    } catch (error) {
      console.error('Error requesting permission:', error);
      
      toast({
        title: "Error",
        description: "Failed to request camera permission",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestCameraPermission
  };
};
