
import { useState, useCallback, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { useToast } from '@/hooks/use-toast';

export const useZXingBarcodeScanner = (
  autoStart: boolean = false,
  onScan: (code: string) => void,
  onClose: () => void
) => {
  const [isNativePlatform, setIsNativePlatform] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanActive, setScanActive] = useState(false);
  const { toast } = useToast();

  // Check if we're on a native platform on component mount
  useEffect(() => {
    const platform = Capacitor.isNativePlatform();
    setIsNativePlatform(platform);
    
    // If we're on a native platform, check for permissions
    if (platform) {
      checkPermission().catch(console.error);
    }
    
    // Cleanup function when component unmounts
    return () => {
      if (scanActive) {
        stopScan().catch(console.error);
      }
    };
  }, []);
  
  // When permission is granted and autoStart is true, start scanning
  useEffect(() => {
    if (hasPermission === true && autoStart) {
      startScan().catch(console.error);
    }
  }, [hasPermission, autoStart]);

  // Check camera permission
  const checkPermission = async (): Promise<boolean> => {
    try {
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('ملحق MLKitBarcodeScanner غير متاح');
        return false;
      }
      
      const status = await BarcodeScanner.checkPermissions();
      const granted = status.camera === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('خطأ في التحقق من إذن الكاميرا:', error);
      setHasPermission(false);
      return false;
    }
  };
  
  // Request camera permission
  const requestPermission = async (): Promise<boolean> => {
    try {
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('ملحق MLKitBarcodeScanner غير متاح');
        return false;
      }
      
      const status = await BarcodeScanner.requestPermissions();
      const granted = status.camera === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('خطأ في طلب إذن الكاميرا:', error);
      setHasPermission(false);
      return false;
    }
  };
  
  // Check permission and request if not granted
  const checkAndRequestPermissions = async (): Promise<boolean> => {
    try {
      const hasPermissionAlready = await checkPermission();
      
      if (!hasPermissionAlready) {
        return await requestPermission();
      }
      
      return hasPermissionAlready;
    } catch (error) {
      console.error('خطأ في فحص وطلب الأذونات:', error);
      return false;
    }
  };
  
  // Start scanning
  const startScan = async (): Promise<boolean> => {
    try {
      // Check we have permission
      const permissionGranted = await checkAndRequestPermissions();
      if (!permissionGranted) {
        toast({
          title: "فشل في بدء المسح",
          description: "يجب منح إذن الكاميرا لاستخدام الماسح الضوئي",
          variant: "destructive"
        });
        return false;
      }
      
      // Prepare scanner
      setScanActive(true);
      document.body.classList.add('scanner-active');
      
      try {
        // Show camera
        await BarcodeScanner.showBackground();
        await BarcodeScanner.prepare();
        
        // Start scanning
        const result = await BarcodeScanner.scan({
          formats: [
            BarcodeFormat.QrCode,
            BarcodeFormat.Ean13,
            BarcodeFormat.Code128,
            BarcodeFormat.Code39,
            BarcodeFormat.UpcA,
            BarcodeFormat.UpcE
          ]
        });
        
        // Handle scan result
        if (result.barcodes && result.barcodes.length > 0) {
          const code = result.barcodes[0].rawValue;
          if (code) {
            onScan(code);
          }
        }
        
        return true;
      } catch (error) {
        console.error('خطأ في عملية المسح:', error);
        return false;
      } finally {
        // Always clean up scanner resources
        await stopScan();
      }
    } catch (error) {
      console.error('خطأ في بدء المسح:', error);
      setScanActive(false);
      document.body.classList.remove('scanner-active');
      return false;
    }
  };
  
  // Stop scanning
  const stopScan = async (): Promise<boolean> => {
    try {
      setScanActive(false);
      document.body.classList.remove('scanner-active');
      
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          await BarcodeScanner.hideBackground();
          await BarcodeScanner.stopScan();
        } catch (error) {
          console.error('خطأ في إيقاف المسح:', error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('خطأ في إيقاف المسح:', error);
      return false;
    }
  };

  return {
    isNativePlatform,
    hasPermission,
    scanActive,
    startScan,
    stopScan,
    checkAndRequestPermissions
  };
};
