
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';

export interface ScannerActionsProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart: boolean;
  scannerState: ReturnType<typeof import('./useScannerState').useScannerState>;
}

export const useScannerActions = ({ 
  onScan, 
  onClose, 
  autoStart, 
  scannerState 
}: ScannerActionsProps) => {
  const { isLoading, setIsLoading, hasError, setHasError, isScanning, setIsScanning } = scannerState;
  const { toast } = useToast();
  
  useEffect(() => {
    if (autoStart) {
      startScan();
    } else {
      setIsLoading(false);
    }
    
    return () => {
      stopScan();
    };
  }, []);

  const startScan = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        setHasError(true);
        setIsLoading(false);
        
        if (Capacitor.isNativePlatform()) {
          toast({
            title: "خطأ في المسح",
            description: "هذا الجهاز لا يدعم قراءة الباركود",
            variant: "destructive"
          });
        } else {
          toast({
            title: "المسح غير متاح",
            description: "ميزة المسح غير متاحة في المتصفح، يرجى استخدام تطبيق الهاتف",
            variant: "destructive"
          });
        }
        return;
      }
      
      const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
      
      const { camera } = await BarcodeScanner.requestPermissions();
      
      if (camera !== 'granted') {
        setHasError(true);
        setIsLoading(false);
        
        toast({
          title: "تم رفض الإذن",
          description: "يجب السماح باستخدام الكاميرا للمسح",
          variant: "destructive"
        });
        return;
      }
      
      setIsScanning(true);
      setIsLoading(false);
      
      const result = await BarcodeScanner.scan();
      
      if (result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue;
        if (code) {
          onScan(code);
          
          toast({
            title: "تم المسح بنجاح",
            description: `تم مسح الرمز: ${code}`,
          });
        }
      }
      
      stopScan();
      
    } catch (error) {
      console.error('خطأ في المسح:', error);
      setHasError(true);
      setIsLoading(false);
      setIsScanning(false);
      
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء عملية المسح",
        variant: "destructive"
      });
    }
  };

  const stopScan = async () => {
    setIsScanning(false);
    
    if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
      try {
        const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
        await BarcodeScanner.enableTorch(false);
        await BarcodeScanner.stopScan();
      } catch (error) {
        console.error('خطأ في إيقاف المسح:', error);
      }
    }
  };
  
  return {
    startScan,
    stopScan
  };
};
