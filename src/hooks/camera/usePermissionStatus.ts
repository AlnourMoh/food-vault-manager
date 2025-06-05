
import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';

export const usePermissionStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const checkPermission = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!Capacitor.isNativePlatform()) {
        setHasPermission(false);
        return false;
      }

      // Try MLKit first
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const status = await BarcodeScanner.checkPermissions();
        const granted = status.camera === 'granted';
        setHasPermission(granted);
        return granted;
      }

      // Fallback to Camera plugin
      if (Capacitor.isPluginAvailable('Camera')) {
        const status = await Camera.checkPermissions();
        const granted = status.camera === 'granted';
        setHasPermission(granted);
        return granted;
      }

      setHasPermission(false);
      return false;
    } catch (error) {
      console.error('Error checking permissions:', error);
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    hasPermission,
    setHasPermission,
    checkPermission
  };
};
