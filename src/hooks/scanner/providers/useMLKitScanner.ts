
import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import '@/types/barcode-scanner-augmentation.d.ts';

export const useMLKitScanner = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<boolean>(false);
  const [onScanCallback, setOnScanCallback] = useState<((code: string) => void) | null>(null);

  const registerScanCallback = useCallback((callback: (code: string) => void) => {
    setOnScanCallback(callback);
  }, []);

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
        console.log('[useMLKitScanner] تحضير الماسح...');
        await BarcodeScanner.prepare();
        console.log('[useMLKitScanner] تم تحضير الماسح');
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
      console.log('[useMLKitScanner] إظهار خلفية الماسح');
      await BarcodeScanner.showBackground();
      
      setIsScanning(true);
      console.log('[useMLKitScanner] بدء مسح الباركود');
      
      const result = await BarcodeScanner.scan();
      console.log('[useMLKitScanner] نتيجة المسح:', result);
      
      setIsScanning(false);
      
      // معالجة النتيجة
      if (result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue;
        if (code && onScanCallback) {
          console.log('[useMLKitScanner] تم مسح الرمز:', code);
          onScanCallback(code);
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
  }, [onScanCallback]);
  
  const stopScan = useCallback(async (): Promise<boolean> => {
    try {
      setIsScanning(false);
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // إيقاف المسح
        console.log('[useMLKitScanner] إخفاء خلفية الماسح');
        await BarcodeScanner.hideBackground();
        console.log('[useMLKitScanner] إيقاف المسح');
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
    stopScan,
    setOnScanCallback: registerScanCallback
  };
};
