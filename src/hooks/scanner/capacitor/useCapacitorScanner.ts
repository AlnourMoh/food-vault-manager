
import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { useToast } from '@/hooks/use-toast';

/**
 * هوك للتعامل مع عمليات المسح في Capacitor
 */
export const useCapacitorScanner = (onScan?: (code: string) => void) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<boolean>(false);
  const { toast } = useToast();

  /**
   * بدء عملية المسح
   */
  const startScan = useCallback(async (): Promise<boolean> => {
    try {
      if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('المنصة أو الملحق غير متاح');
        return false;
      }
      
      setScanError(false);
      setIsScanning(true);
      
      try {
        // تجهيز الماسح
        await BarcodeScanner.showBackground();
        await BarcodeScanner.prepare();
        
        // بدء المسح
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
        
        // معالجة النتيجة
        if (result.barcodes && result.barcodes.length > 0) {
          const code = result.barcodes[0].rawValue;
          if (code && onScan) {
            onScan(code);
          }
        }
        
        return true;
      } catch (error) {
        console.error('خطأ في عملية المسح:', error);
        setScanError(true);
        
        toast({
          title: "خطأ في المسح",
          description: "حدث خطأ أثناء عملية المسح",
          variant: "destructive"
        });
        
        return false;
      } finally {
        // تنظيف موارد الماسح
        await stopScan();
      }
    } catch (error) {
      console.error('خطأ في بدء المسح:', error);
      setScanError(true);
      setIsScanning(false);
      
      toast({
        title: "خطأ في بدء المسح",
        description: "تعذر بدء عملية المسح",
        variant: "destructive"
      });
      
      return false;
    }
  }, [onScan, toast]);

  /**
   * إيقاف عملية المسح
   */
  const stopScan = useCallback(async (): Promise<boolean> => {
    try {
      setIsScanning(false);
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
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
  }, []);

  return {
    isScanning,
    setIsScanning,
    scanError,
    setScanError,
    startScan,
    stopScan
  };
};
