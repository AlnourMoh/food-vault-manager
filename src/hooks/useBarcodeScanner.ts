
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useBarcodeScanner = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const { toast } = useToast();

  // تهيئة BarcodeScanner وإضافة المستمعين عند تحميل المكون
  useEffect(() => {
    const prepareScanner = async () => {
      try {
        await BarcodeScanner.prepare();
      } catch (error) {
        console.error('Error preparing barcode scanner:', error);
      }
    };

    prepareScanner();

    // تنظيف عند إزالة المكون
    return () => {
      if (isScanning) {
        BarcodeScanner.stopScan();
        BarcodeScanner.showBackground();
      }
    };
  }, [isScanning]);

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
      
      // إضافة CSS للصفحة لإخفاء المحتوى أثناء المسح
      document.body.classList.add('barcode-scanner-active');
      
      // Make the background visible behind the scanner
      await BarcodeScanner.hideBackground();
      
      // Start the scan process
      const result = await BarcodeScanner.startScan();
      
      // إزالة CSS عند الانتهاء من المسح
      document.body.classList.remove('barcode-scanner-active');
      
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
      // التأكد من إعادة الخلفية في حالة حدوث خطأ
      document.body.classList.remove('barcode-scanner-active');
      await BarcodeScanner.showBackground();
      
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
      document.body.classList.remove('barcode-scanner-active');
      await BarcodeScanner.stopScan();
      await BarcodeScanner.showBackground();
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
