
import { Barcode, BarcodeScanner } from '@capacitor/barcode-scanner';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useBarcodeScanner = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const { toast } = useToast();

  // Check and request permissions
  const checkPermissions = async (): Promise<boolean> => {
    try {
      const { granted } = await BarcodeScanner.checkPermission({ force: false });
      
      if (!granted) {
        const { granted } = await BarcodeScanner.checkPermission({ force: true });
        
        if (granted) {
          setHasPermission(true);
          return true;
        } else {
          toast({
            title: "تم رفض الصلاحيات",
            description: "لا يمكن استخدام ماسح الباركود بدون صلاحيات الكاميرا",
            variant: "destructive"
          });
          return false;
        }
      } else {
        setHasPermission(true);
        return true;
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      toast({
        title: "خطأ في التحقق من الصلاحيات",
        description: "حدث خطأ أثناء التحقق من صلاحيات الكاميرا",
        variant: "destructive"
      });
      return false;
    }
  };

  // Start scanning
  const startScan = async (): Promise<string | null> => {
    try {
      const permissionGranted = await checkPermissions();
      
      if (!permissionGranted) {
        return null;
      }
      
      setIsScanning(true);
      
      // Make the background visible behind the scanner
      await BarcodeScanner.hideBackground();
      
      // Start the scan process
      const result = await BarcodeScanner.startScan();
      
      if (result.hasContent) {
        setScannedCode(result.content);
        setIsScanning(false);
        return result.content;
      }
      
      setIsScanning(false);
      return null;
    } catch (error) {
      console.error('Scanning error:', error);
      setIsScanning(false);
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء مسح الباركود",
        variant: "destructive"
      });
      return null;
    }
  };

  // Stop scanning
  const stopScan = async () => {
    try {
      setIsScanning(false);
      await BarcodeScanner.stopScan();
    } catch (error) {
      console.error('Error stopping scan:', error);
    }
  };

  return {
    startScan,
    stopScan,
    hasPermission,
    isScanning,
    scannedCode,
    setScannedCode
  };
};
