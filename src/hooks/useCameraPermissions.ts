
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

        // First try to check with BarcodeScanner plugin
        const barcodeStatus = await checkBarcodePermission();
        if (barcodeStatus) {
          console.log('Barcode permission status:', barcodeStatus);
          setHasPermission(barcodeStatus.granted);
          setIsLoading(false);
          return;
        }

        // If BarcodeScanner not available, try with Camera plugin
        const cameraStatus = await checkCameraPermission();
        if (cameraStatus) {
          console.log('Camera permission status:', cameraStatus);
          setHasPermission(cameraStatus.granted);
          setIsLoading(false);
          return;
        }

        // For web testing, assume permission granted
        console.log('No native camera plugins available, assuming web environment');
        setHasPermission(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking camera permissions:', error);
        setHasPermission(false);
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, []);

  // Method to request permission and update state accordingly
  const requestCameraPermission = async (force = true) => {
    try {
      console.log(`Explicitly requesting camera permission with force=${force}...`);
      const result = await requestPermission(force);
      console.log('Permission request result:', result);
      setHasPermission(result);
      return result;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  return {
    isLoading,
    hasPermission,
    requestPermission: requestCameraPermission
  };
};
