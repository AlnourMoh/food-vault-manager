
import { useState, useEffect } from 'react';
import { usePermissionCheck } from './scanner/permissions/usePermissionCheck';
import { usePermissionRequest } from './scanner/permissions/usePermissionRequest';
import { useToast } from './use-toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useCameraPermissions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { checkCameraPermission } = usePermissionCheck();
  const { requestPermission } = usePermissionRequest();
  const { toast } = useToast();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        console.log('[useCameraPermissions] فحص أذونات الكاميرا...');
        setIsLoading(true);

        // Check if MLKit is available
        if (window.Capacitor) {
          console.log('[useCameraPermissions] Checking MLKit availability...');
          
          try {
            const available = await BarcodeScanner.isSupported();
            console.log('[useCameraPermissions] MLKit available:', available);
            
            if (available) {
              const status = await BarcodeScanner.checkPermissions();
              console.log('[useCameraPermissions] MLKit permission status:', status);
              
              if (status.camera === 'granted') {
                setHasPermission(true);
                setIsLoading(false);
                return;
              } else if (status.camera === 'denied') {
                setHasPermission(false);
                setIsLoading(false);
                return;
              }
              // If status is prompt, we'll fall through to other permission checks
            }
          } catch (error) {
            console.error('[useCameraPermissions] Error checking MLKit permissions:', error);
          }

          // Try using the camera plugin permissions
          console.log('[useCameraPermissions] Trying camera plugin permissions');
          const cameraStatus = await checkCameraPermission();
          if (cameraStatus) {
            console.log('[useCameraPermissions] Camera plugin permission status:', cameraStatus);
            setHasPermission(cameraStatus.granted);
            setIsLoading(false);
            return;
          }
        }

        // For web testing, assume permission is granted
        console.log('[useCameraPermissions] Assuming permission for web environment');
        setHasPermission(true);
        setIsLoading(false);
      } catch (error) {
        console.error('[useCameraPermissions] Error checking permissions:', error);
        toast({
          title: "خطأ في الأذونات",
          description: "حدث خطأ أثناء التحقق من أذونات الكاميرا",
          variant: "destructive"
        });
        setHasPermission(false);
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, []);

  const requestCameraPermission = async (force = true) => {
    try {
      console.log(`[useCameraPermissions] Requesting camera permission with force=${force}...`);
      setIsLoading(true);
      
      // Try MLKit permissions first
      if (window.Capacitor) {
        try {
          console.log('[useCameraPermissions] Requesting MLKit permissions');
          const permission = await BarcodeScanner.requestPermissions();
          console.log('[useCameraPermissions] MLKit permission result:', permission);
          
          if (permission.camera === 'granted') {
            console.log('[useCameraPermissions] MLKit permission granted');
            setHasPermission(true);
            setIsLoading(false);
            return true;
          } else if (permission.camera === 'denied') {
            console.log('[useCameraPermissions] MLKit permission denied');
            setHasPermission(false);
            setIsLoading(false);
            return false;
          }
          // If status is prompt, we'll fall through to other permission checks
        } catch (error) {
          console.error('[useCameraPermissions] Error requesting MLKit permissions:', error);
        }
      }
      
      // Fall back to general permission request
      console.log('[useCameraPermissions] Using general permission request');
      const result = await requestPermission(force);
      console.log('[useCameraPermissions] General permission result:', result);
      
      setHasPermission(result);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('[useCameraPermissions] Error requesting permission:', error);
      setIsLoading(false);
      toast({
        title: "خطأ في طلب الإذن",
        description: "حدث خطأ أثناء محاولة طلب إذن الكاميرا",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    isLoading,
    hasPermission,
    requestPermission: requestCameraPermission
  };
};
