
import { useCallback } from 'react';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

interface UseBarcodeScanningProps {
  onScan: (code: string) => void;
  isScanningActive: boolean;
  setIsScanningActive: (active: boolean) => void;
  cameraActive: boolean;
  hasScannerError: boolean;
  setHasScannerError: (error: boolean) => void;
}

export const useBarcodeScanning = ({
  onScan,
  isScanningActive,
  setIsScanningActive,
  cameraActive,
  hasScannerError,
  setHasScannerError
}: UseBarcodeScanningProps) => {

  // بدء المسح
  const startScan = useCallback(async (): Promise<boolean> => {
    if (isScanningActive || !cameraActive || hasScannerError) {
      console.log('useBarcodeScanning: لا يمكن بدء المسح، المسح نشط بالفعل أو الكاميرا غير نشطة أو هناك خطأ');
      return false;
    }

    try {
      console.log('useBarcodeScanning: بدء المسح...');
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // التحقق من دعم جهاز المستخدم للماسح
        const supported = await BarcodeScanner.isSupported();
        if (!supported.supported) {
          console.error('useBarcodeScanning: جهاز المستخدم لا يدعم مسح الباركود');
          setHasScannerError(true);
          await Toast.show({
            text: 'جهازك لا يدعم مسح الرموز الشريطية',
            duration: 'short'
          });
          return false;
        }
        
        // بدء المسح
        await BarcodeScanner.scan({
          formats: [
            BarcodeFormat.QR_CODE,
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8,
            BarcodeFormat.CODE_39,
            BarcodeFormat.CODE_128
          ]
        });
        
        // إضافة مستمع للأحداث
        const listener = await BarcodeScanner.addListener('barcodesScanned', (result) => {
          if (result && result.barcodes && result.barcodes.length > 0) {
            console.log('useBarcodeScanning: تم العثور على باركود:', result.barcodes[0].rawValue);
            onScan(result.barcodes[0].rawValue);
            // إزالة المستمع بعد المسح
            listener.remove();
          }
        });
      } else {
        // في بيئة الويب، نحاكي عملية المسح
        console.log('useBarcodeScanning: محاكاة عملية المسح في بيئة الويب');
        
        // محاكاة وجود مسح بعد فترة
        setTimeout(() => {
          console.log('useBarcodeScanning: محاكاة اكتشاف باركود');
          onScan("TEST_BARCODE_123456");
        }, 3000);
      }
      
      setIsScanningActive(true);
      return true;
    } catch (error) {
      console.error('useBarcodeScanning: خطأ في بدء المسح:', error);
      setHasScannerError(true);
      setIsScanningActive(false);
      return false;
    }
  }, [isScanningActive, cameraActive, hasScannerError, setIsScanningActive, setHasScannerError, onScan]);

  // إيقاف المسح
  const stopScan = useCallback(async (): Promise<boolean> => {
    if (!isScanningActive) {
      return true;
    }

    try {
      console.log('useBarcodeScanning: إيقاف المسح...');
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // إيقاف المسح
        await BarcodeScanner.removeAllListeners();
      }
      
      setIsScanningActive(false);
      return true;
    } catch (error) {
      console.error('useBarcodeScanning: خطأ في إيقاف المسح:', error);
      setIsScanningActive(false);
      return false;
    }
  }, [isScanningActive, setIsScanningActive]);

  return {
    startScan,
    stopScan
  };
};
