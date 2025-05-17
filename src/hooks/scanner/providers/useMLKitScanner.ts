
import { useState } from 'react';
import { BarcodeFormat, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';

// Import the augmented type definitions
import '@/types/barcode-scanner-augmentation.d.ts';

export const useMLKitScanner = () => {
  const [isScanActive, setIsScanActive] = useState(false);
  const { toast } = useToast();

  const startMLKitScan = async (onSuccess: (code: string) => void): Promise<boolean> => {
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
      
      // تهيئة الماسح - using the augmented interface
      try {
        await BarcodeScanner.prepare();
      } catch (error) {
        console.error('[useMLKitScanner] خطأ في تهيئة الماسح:', error);
      }
      
      setIsScanActive(true);

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

      setIsScanActive(false);
      
      try {
        // Fixed: call stopScan without arguments
        await BarcodeScanner.stopScan();
      } catch (error) {
        console.error('[useMLKitScanner] خطأ في إيقاف المسح:', error);
      }

      if (result.barcodes && result.barcodes.length > 0) {
        const barcodeValue = result.barcodes[0].rawValue;
        if (barcodeValue) {
          onSuccess(barcodeValue);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في المسح:', error);
      setIsScanActive(false);
      
      try {
        // Fixed: call stopScan without arguments
        await BarcodeScanner.stopScan();
      } catch (err) {
        console.error('[useMLKitScanner] خطأ في إيقاف المسح بعد خطأ:', err);
      }
      
      return false;
    }
  };

  return {
    isScanActive,
    startMLKitScan
  };
};
