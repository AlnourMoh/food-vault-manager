
import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeFormat, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { useToast } from '@/hooks/use-toast';

// تأكد من استيراد تعريفات الأنواع الإضافية
import '@/types/barcode-scanner-augmentation.d.ts';

export const useCapacitorScanner = (onScan?: (code: string) => void) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<boolean>(false);
  const { toast } = useToast();

  /**
   * بدء عملية المسح
   */
  const startScan = useCallback(async (): Promise<boolean> => {
    try {
      if (!Capacitor.isNativePlatform()) {
        console.log('MLKitScanner: ليست منصة أصلية، لن يتم بدء المسح');
        return false;
      }

      const hasPermission = await BarcodeScanner.checkPermissions();
      if (hasPermission.camera !== 'granted') {
        const requestResult = await BarcodeScanner.requestPermissions();
        if (requestResult.camera !== 'granted') {
          toast({
            title: "فشل في بدء المسح",
            description: "يجب منح إذن الكاميرا لاستخدام الماسح الضوئي",
            variant: "destructive"
          });
          return false;
        }
      }
      
      // تهيئة الماسح - using the extended interface from barcode-scanner-augmentation.d.ts
      try {
        await BarcodeScanner.showBackground();
        await BarcodeScanner.prepare();
      } catch (error) {
        console.error('[useCapacitorScanner] خطأ في تهيئة الماسح:', error);
      }
      
      setIsScanning(true);

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

      setIsScanning(false);
      
      try {
        // Fixed: call stopScan without arguments
        await BarcodeScanner.stopScan();
      } catch (error) {
        console.error('[useCapacitorScanner] خطأ في إيقاف المسح:', error);
      }

      if (result.barcodes && result.barcodes.length > 0) {
        const barcodeValue = result.barcodes[0].rawValue;
        if (barcodeValue) {
          onScan?.(barcodeValue);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('[useCapacitorScanner] خطأ في المسح:', error);
      setIsScanning(false);
      
      try {
        // Fixed: call stopScan without arguments
        await BarcodeScanner.stopScan();
      } catch (err) {
        console.error('[useCapacitorScanner] خطأ في إيقاف المسح بعد خطأ:', err);
      }
      
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
          // Fixed: call stopScan without arguments
          await BarcodeScanner.stopScan();
        } catch (error) {
          console.error('[useCapacitorScanner] خطأ في إيقاف المسح:', error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('[useCapacitorScanner] خطأ في إيقاف المسح:', error);
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
