
import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import '@/types/barcode-scanner-augmentation.d.ts';

export const useMLKitScanner = (onScan?: (code: string) => void) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<boolean>(false);

  const startScan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useMLKitScanner] بدء المسح');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('[useMLKitScanner] ليست منصة أصلية، لن يتم بدء المسح');
        return false;
      }
      
      // التحقق من توفر الماسح
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[useMLKitScanner] ماسح MLKit غير متوفر');
        return false;
      }
      
      // تهيئة الماسح
      try {
        await BarcodeScanner.prepare();
      } catch (error) {
        console.error('[useMLKitScanner] خطأ في تهيئة الماسح:', error);
      }
      
      // فحص الأذونات
      const permissionStatus = await BarcodeScanner.checkPermissions();
      if (permissionStatus.camera !== 'granted') {
        console.log('[useMLKitScanner] طلب إذن الكاميرا');
        
        const permissionResult = await BarcodeScanner.requestPermissions();
        if (permissionResult.camera !== 'granted') {
          console.log('[useMLKitScanner] تم رفض إذن الكاميرا');
          await Toast.show({
            text: 'يجب منح إذن الكاميرا لاستخدام الماسح',
            duration: 'long'
          });
          return false;
        }
      }
      
      // بدء المسح
      setIsScanning(true);
      const result = await BarcodeScanner.scan();
      setIsScanning(false);
      
      // معالجة النتيجة
      if (result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue;
        if (code) {
          console.log('[useMLKitScanner] تم مسح الرمز:', code);
          onScan?.(code);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في المسح:', error);
      setIsScanning(false);
      setScanError(true);
      return false;
    }
  }, [onScan]);
  
  const stopScan = useCallback(async (): Promise<boolean> => {
    try {
      setIsScanning(false);
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // إيقاف المسح
        await BarcodeScanner.stopScan();
      }
      
      return true;
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في إيقاف المسح:', error);
      return false;
    }
  }, []);
  
  return {
    isScanning,
    scanError,
    startScan,
    stopScan
  };
};
