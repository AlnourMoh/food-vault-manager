
import { useState, useEffect } from 'react';
import { usePermissionCheck } from './scanner/permissions/usePermissionCheck';
import { usePermissionRequest } from './scanner/permissions/usePermissionRequest';

export const useCameraPermissions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { checkBarcodePermission, checkCameraPermission } = usePermissionCheck();
  const { requestPermission } = usePermissionRequest();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        console.log('Checking camera permissions...');
        setIsLoading(true);

        const barcodeStatus = await checkBarcodePermission();
        if (barcodeStatus) {
          setHasPermission(barcodeStatus.granted);
          return;
        }

        const cameraStatus = await checkCameraPermission();
        if (cameraStatus) {
          setHasPermission(cameraStatus.granted);
          return;
        }

        // For web testing, assume permission granted
        setHasPermission(true);
      } catch (error) {
        console.error('Error checking camera permissions:', error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, []);

  return {
    isLoading,
    hasPermission,
    requestPermission
  };
};
