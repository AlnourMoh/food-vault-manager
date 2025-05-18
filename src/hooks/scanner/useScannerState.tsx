
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
      
      try {
        // التحقق من دعم المسح
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
        // حتى مع وجود خطأ، سنحاول المتابعة
      }
      
      // محاولة تهيئة الماسح بشكل مباشر
      try {
        console.log('[useScannerState] تهيئة الماسح...');
        await BarcodeScanner.prepare();
        console.log('[useScannerState] تم تهيئة الماسح بنجاح');
      } catch (error) {
        console.warn('[useScannerState] خطأ في تهيئة الماسح:', error);
        // سنحاول المتابعة رغم الخطأ
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
      
      // محاولة إيقاف المسح إذا كان الملحق متاحًا
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
    initializeScanner,
    cleanupScanner
  };
};
