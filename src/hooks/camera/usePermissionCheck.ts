
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';

export const usePermissionCheck = (permissionStatus: any) => {
  const { setIsLoading, setHasPermission } = permissionStatus;

  useEffect(() => {
    const checkInitialPermission = async () => {
      try {
        setIsLoading(true);
        
        if (!Capacitor.isNativePlatform()) {
          setHasPermission(false);
          return;
        }

        // Try MLKit first
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          const status = await BarcodeScanner.checkPermissions();
          setHasPermission(status.camera === 'granted');
          return;
        }

        // Fallback to Camera plugin
        if (Capacitor.isPluginAvailable('Camera')) {
          const status = await Camera.checkPermissions();
          setHasPermission(status.camera === 'granted');
          return;
        }

        setHasPermission(false);
      } catch (error) {
        console.error('Error checking permissions:', error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialPermission();
  }, [setIsLoading, setHasPermission]);
};
