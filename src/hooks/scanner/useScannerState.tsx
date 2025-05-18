
import { useState, useEffect, useCallback } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';
import '@/types/barcode-scanner-augmentation.d.ts';

export const useScannerState = (autoStart = false) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isScanning, setIsScanning] = useState(autoStart);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const { toast } = useToast();

  // تهيئة الماسح
  const initializeScanner = useCallback(async () => {
    try {
      console.log('[useScannerState] تهيئة الماسح...');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('[useScannerState] ليست منصة أصلية، لن يتم تهيئة الماسح');
        setIsLoading(false);
        return;
      }
      
      // التحقق من توفر الملحق
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[useScannerState] ملحق المسح غير متوفر');
        setIsLoading(false);
        return;
      }
      
      // التحقق من دعم المسح
      try {
        const { supported } = await BarcodeScanner.isSupported();
        console.log('[useScannerState] هل المسح مدعوم؟', supported);
        
        if (!supported) {
          setErrorMessage('الجهاز لا يدعم مسح الباركود');
          setHasError(true);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.warn('[useScannerState] خطأ في التحقق من دعم المسح:', error);
      }
      
      // التحقق من أذونات الكاميرا
      try {
        const permissionStatus = await BarcodeScanner.checkPermissions();
        if (permissionStatus.camera !== 'granted') {
          console.log('[useScannerState] طلب إذن الكاميرا');
          const result = await BarcodeScanner.requestPermissions();
          if (result.camera !== 'granted') {
            setErrorMessage('تم رفض إذن الكاميرا');
            setHasError(true);
            setIsLoading(false);
            return;
          }
        }
      } catch (permError) {
        console.warn('[useScannerState] خطأ في فحص/طلب الإذن:', permError);
      }
      
      // تحضير الماسح
      try {
        console.log('[useScannerState] تحضير الماسح...');
        await BarcodeScanner.prepare();
        console.log('[useScannerState] تم تحضير الماسح بنجاح');
        
        // محاولة إظهار خلفية الكاميرا
        try {
          await BarcodeScanner.hideBackground();
          await BarcodeScanner.showBackground();
          setCameraActive(true);
          console.log('[useScannerState] تم إظهار خلفية الكاميرا بنجاح');
        } catch (backgroundError) {
          console.warn('[useScannerState] خطأ في إظهار خلفية الكاميرا:', backgroundError);
        }
      } catch (error) {
        console.warn('[useScannerState] خطأ في تحضير الماسح:', error);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('[useScannerState] خطأ في تهيئة الماسح:', error);
      setHasError(true);
      setErrorMessage('تعذر تهيئة الماسح الضوئي');
      setIsLoading(false);
    }
  }, []);

  // إنهاء عملية المسح وتحرير الموارد
  const cleanupScanner = useCallback(async () => {
    try {
      console.log('[useScannerState] تنظيف الماسح');
      setIsScanning(false);
      setCameraActive(false);
      
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          // إيقاف الفلاش إذا كان مفعلاً
          await BarcodeScanner.enableTorch({ enable: false }).catch(() => {});
          
          // إخفاء خلفية الماسح
          await BarcodeScanner.hideBackground().catch(() => {});
          
          // إيقاف المسح
          await BarcodeScanner.stopScan().catch(() => {});
          
          console.log('[useScannerState] تم إيقاف المسح بنجاح');
        } catch (error) {
          console.error('[useScannerState] خطأ في إيقاف المسح:', error);
        }
      }
    } catch (error) {
      console.error('[useScannerState] خطأ في تنظيف الماسح:', error);
    }
  }, []);

  // تهيئة الماسح عند تحميل المكون
  useEffect(() => {
    initializeScanner();
    
    // تنظيف الموارد عند إزالة المكون
    return () => {
      cleanupScanner();
    };
  }, [initializeScanner, cleanupScanner]);

  return {
    isLoading,
    setIsLoading,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    isScanning,
    setIsScanning,
    cameraActive,
    setCameraActive,
    initializeScanner,
    cleanupScanner
  };
};
