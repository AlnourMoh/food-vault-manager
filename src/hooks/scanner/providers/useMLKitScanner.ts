
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
    setOnScanCallback(() => callback);
  }, []);

  const startScan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useMLKitScanner] بدء المسح');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('[useMLKitScanner] ليست منصة أصلية، لن يتم بدء المسح');
        return false;
      }
      
      // التحقق من توفر الماسح
      if (!Capacitor.isPluginAvailable('BarcodeScanner') && !Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[useMLKitScanner] ماسح الباركود غير متوفر');
        return false;
      }
      
      // تهيئة الماسح
      try {
        console.log('[useMLKitScanner] تحضير الماسح...');
        await BarcodeScanner.prepare();
        console.log('[useMLKitScanner] تم تحضير الماسح');
      } catch (error) {
        console.error('[useMLKitScanner] خطأ في تهيئة الماسح:', error);
        // حتى مع وجود خطأ، سنحاول المتابعة
      }
      
      // فحص الأذونات - محاولة مع إعادة المحاولة
      for (let attempts = 0; attempts < 3; attempts++) {
        try {
          console.log('[useMLKitScanner] محاولة فحص الإذن', attempts + 1);
          const permissionStatus = await BarcodeScanner.checkPermissions();
          console.log('[useMLKitScanner] حالة الإذن:', permissionStatus);
          
          if (permissionStatus.camera === 'granted') {
            console.log('[useMLKitScanner] تم منح إذن الكاميرا بالفعل');
            break;
          }
          
          // طلب الإذن إذا لم يكن ممنوحًا
          console.log('[useMLKitScanner] طلب إذن الكاميرا');
          const permissionResult = await BarcodeScanner.requestPermissions();
          console.log('[useMLKitScanner] نتيجة طلب الإذن:', permissionResult);
          
          if (permissionResult.camera === 'granted') {
            console.log('[useMLKitScanner] تم منح إذن الكاميرا');
            break;
          } else if (attempts === 2) { // في المحاولة الأخيرة
            console.log('[useMLKitScanner] تم رفض إذن الكاميرا بشكل نهائي');
            await Toast.show({
              text: 'يجب منح إذن الكاميرا لاستخدام الماسح',
              duration: 'long'
            });
            setScanError(true);
            return false;
          }
          
          // انتظار قليلاً قبل إعادة المحاولة
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (permError) {
          console.error('[useMLKitScanner] خطأ في فحص/طلب الإذن:', permError);
          if (attempts === 2) { // في المحاولة الأخيرة
            setScanError(true);
            return false;
          }
        }
      }
      
      // بدء المسح
      try {
        console.log('[useMLKitScanner] إظهار خلفية الماسح');
        await BarcodeScanner.hideBackground();
        await BarcodeScanner.showBackground();
        
        setIsScanning(true);
        setScanError(false);
        console.log('[useMLKitScanner] بدء مسح الباركود');
        
        const result = await BarcodeScanner.scan();
        console.log('[useMLKitScanner] نتيجة المسح:', result);
        
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
      } catch (scanError) {
        console.error('[useMLKitScanner] خطأ في المسح:', scanError);
        setScanError(true);
        return false;
      } finally {
        setIsScanning(false);
      }
    } catch (error) {
      console.error('[useMLKitScanner] خطأ عام في المسح:', error);
      setIsScanning(false);
      setScanError(true);
      return false;
    }
  }, [onScanCallback]);
  
  const stopScan = useCallback(async (): Promise<boolean> => {
    try {
      setIsScanning(false);
      
      if (Capacitor.isNativePlatform()) {
        // إيقاف المسح
        try {
          console.log('[useMLKitScanner] إخفاء خلفية الماسح');
          await BarcodeScanner.hideBackground();
        } catch (e) {
          console.error('[useMLKitScanner] خطأ في إخفاء الخلفية:', e);
        }
        
        try {
          console.log('[useMLKitScanner] إيقاف المسح');
          await BarcodeScanner.stopScan();
        } catch (e) {
          console.error('[useMLKitScanner] خطأ في إيقاف المسح:', e);
        }
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
