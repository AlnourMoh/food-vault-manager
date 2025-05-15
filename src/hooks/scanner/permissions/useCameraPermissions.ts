
import { useState, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';

export const useCameraPermissions = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  // Check permissions when component mounts
  useEffect(() => {
    checkPermissions();
  }, []);

  // Function to check camera permissions
  const checkPermissions = async () => {
    try {
      setIsChecking(true);
      
      if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[useCameraPermissions] Not a native platform or scanner not available');
        setHasPermission(false);
        return false;
      }
      
      const permissionStatus = await BarcodeScanner.checkPermissions();
      const granted = permissionStatus.camera === 'granted';
      
      console.log('[useCameraPermissions] Camera permission status:', permissionStatus);
      setHasPermission(granted);
      
      return granted;
    } catch (error) {
      console.error('[useCameraPermissions] Error checking permissions:', error);
      setHasPermission(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  // Function to request camera permissions
  const requestPermission = async () => {
    try {
      setIsChecking(true);
      
      if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[useCameraPermissions] Not a native platform or scanner not available');
        setHasPermission(false);
        return false;
      }
      
      const permissionResult = await BarcodeScanner.requestPermissions();
      const granted = permissionResult.camera === 'granted';
      
      console.log('[useCameraPermissions] Camera permission request result:', permissionResult);
      setHasPermission(granted);
      
      if (!granted) {
        toast({
          title: "تم رفض الإذن",
          description: "لم يتم منح إذن الكاميرا. يرجى تمكين الإذن في إعدادات جهازك",
          variant: "destructive"
        });
      }
      
      return granted;
    } catch (error) {
      console.error('[useCameraPermissions] Error requesting permissions:', error);
      setHasPermission(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    hasPermission,
    isChecking,
    checkPermission: checkPermissions,
    requestPermission
  };
};
