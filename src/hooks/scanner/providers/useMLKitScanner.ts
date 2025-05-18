
import { useState, useCallback, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import '@/types/barcode-scanner-augmentation.d.ts';

export const useMLKitScanner = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<boolean>(false);
  const [onScanCallback, setOnScanCallback] = useState<((code: string) => void) | null>(null);
  const [cameraReady, setCameraReady] = useState<boolean>(false);

  // تسجيل معالج النتيجة
  const registerScanCallback = useCallback((callback: (code: string) => void) => {
    setOnScanCallback(() => callback);
  }, []);

  // تهيئة الكاميرا بشكل منفصل
  const initializeCamera = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useMLKitScanner] تهيئة الكاميرا...');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('[useMLKitScanner] ليست منصة أصلية');
        return false;
      }
      
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[useMLKitScanner] ملحق MLKitBarcodeScanner غير متوفر');
        return false;
      }
      
      // التحقق من دعم المسح
      try {
        const result = await BarcodeScanner.isSupported();
        if (!result.supported) {
          console.log('[useMLKitScanner] المسح غير مدعوم على هذا الجهاز');
          return false;
        }
      } catch (error) {
        console.warn('[useMLKitScanner] خطأ في التحقق من دعم المسح:', error);
      }
      
      // تحضير الكاميرا
      try {
        await BarcodeScanner.prepare();
        console.log('[useMLKitScanner] تم تحضير الماسح بنجاح');
      } catch (prepareError) {
        console.error('[useMLKitScanner] خطأ في تحضير الماسح:', prepareError);
        // سنحاول المتابعة رغم الخطأ
      }
      
      // التحقق من أذونات الكاميرا
      try {
        const permissionStatus = await BarcodeScanner.checkPermissions();
        console.log('[useMLKitScanner] حالة أذونات الكاميرا:', permissionStatus);
        
        if (permissionStatus.camera !== 'granted') {
          console.log('[useMLKitScanner] طلب إذن الكاميرا');
          const requestResult = await BarcodeScanner.requestPermissions();
          
          if (requestResult.camera !== 'granted') {
            console.error('[useMLKitScanner] تم رفض إذن الكاميرا');
            return false;
          }
        }
      } catch (permissionError) {
        console.error('[useMLKitScanner] خطأ في التحقق من أذونات الكاميرا:', permissionError);
        return false;
      }
      
      // إظهار خلفية عارض الكاميرا
      try {
        await BarcodeScanner.hideBackground();
        await BarcodeScanner.showBackground();
        console.log('[useMLKitScanner] تم إظهار خلفية الكاميرا');
      } catch (backgroundError) {
        console.warn('[useMLKitScanner] خطأ في إظهار خلفية الكاميرا:', backgroundError);
      }
      
      setCameraReady(true);
      return true;
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في تهيئة الكاميرا:', error);
      return false;
    }
  }, []);

  // البدء في المسح
  const startScan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useMLKitScanner] بدء المسح');
      
      // التحقق من بيئة التشغيل
      if (!Capacitor.isNativePlatform()) {
        console.log('[useMLKitScanner] ليست منصة أصلية، لن يتم بدء المسح');
        return false;
      }
      
      // تهيئة الكاميرا إذا لم تكن جاهزة
      if (!cameraReady) {
        const initialized = await initializeCamera();
        if (!initialized) {
          console.error('[useMLKitScanner] فشل في تهيئة الكاميرا');
          setScanError(true);
          return false;
        }
      }
      
      // عرض صفحة المسح
      try {
        console.log('[useMLKitScanner] إظهار خلفية المسح');
        await BarcodeScanner.showBackground();
      } catch (e) {
        console.warn('[useMLKitScanner] خطأ في إظهار الخلفية:', e);
      }
      
      setIsScanning(true);
      setScanError(false);
      
      console.log('[useMLKitScanner] بدء مسح الباركود');
      
      // التأكد من معالج النتيجة
      if (!onScanCallback) {
        console.error('[useMLKitScanner] معالج نتيجة المسح غير مسجل');
        setIsScanning(false);
        return false;
      }
      
      // بدء المسح الفعلي
      try {
        const result = await BarcodeScanner.scan();
        console.log('[useMLKitScanner] نتيجة المسح:', result);
        
        setIsScanning(false);
        
        // معالجة النتيجة
        if (result.barcodes && result.barcodes.length > 0) {
          const code = result.barcodes[0].rawValue;
          if (code) {
            console.log('[useMLKitScanner] تم مسح الرمز:', code);
            onScanCallback(code);
            return true;
          }
        }
        
        return false;
      } catch (scanError) {
        console.error('[useMLKitScanner] خطأ في المسح:', scanError);
        setIsScanning(false);
        setScanError(true);
        return false;
      }
    } catch (error) {
      console.error('[useMLKitScanner] خطأ عام في المسح:', error);
      setIsScanning(false);
      setScanError(true);
      return false;
    }
  }, [cameraReady, onScanCallback, initializeCamera]);
  
  const stopScan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useMLKitScanner] إيقاف المسح');
      setIsScanning(false);
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // محاولة إخفاء الخلفية
        try {
          await BarcodeScanner.hideBackground();
          console.log('[useMLKitScanner] تم إخفاء خلفية المسح');
        } catch (hideError) {
          console.warn('[useMLKitScanner] خطأ في إخفاء الخلفية:', hideError);
        }
        
        // إيقاف المسح
        try {
          await BarcodeScanner.stopScan();
          console.log('[useMLKitScanner] تم إيقاف المسح');
        } catch (stopError) {
          console.warn('[useMLKitScanner] خطأ في إيقاف المسح:', stopError);
        }
      }
      
      return true;
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في إيقاف المسح:', error);
      return false;
    }
  }, []);
  
  // التنظيف عند إزالة المكون
  useEffect(() => {
    return () => {
      // إيقاف المسح وتنظيف الموارد عند إزالة المكون
      console.log('[useMLKitScanner] تنظيف موارد الماسح عند إزالة المكون');
      stopScan().catch(console.error);
    };
  }, [stopScan]);

  return {
    isScanning,
    scanError,
    cameraReady,
    startScan,
    stopScan,
    initializeCamera,
    setOnScanCallback: registerScanCallback
  };
};
