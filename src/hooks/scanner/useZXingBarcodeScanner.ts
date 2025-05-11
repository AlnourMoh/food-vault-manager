
import { useState, useCallback, useEffect } from 'react';
import { useBarcodeScanning } from './modules/useBarcodeScanning';
import { useScannerRetry } from './modules/useScannerRetry';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

interface UseZXingBarcodeScannerOptions {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

export const useZXingBarcodeScanner = ({ 
  onScan, 
  onClose, 
  autoStart = true 
}: UseZXingBarcodeScannerOptions) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);

  const { 
    cameraActive: isCameraActive,
    isScanningActive,
    startScan,
    stopScan,
    hasScannerError
  } = useBarcodeScanning({
    onScan,
    onScanError: (error: string) => {
      console.error(`[useZXingBarcodeScanner] خطأ في المسح:`, error);
      setScannerError(`خطأ في المسح: ${error}`);
    },
    onScanComplete: () => {
      console.log('[useZXingBarcodeScanner] اكتمل المسح');
      // إغلاق الماسح بعد المسح إذا لزم الأمر
      onClose();
    }
  });

  // ضبط حالة تنشيط الكاميرا بناءً على الحالة المشتركة
  useEffect(() => {
    setCameraActive(isCameraActive);
  }, [isCameraActive]);

  const { handleRetry } = useScannerRetry({
    setHasScannerError: (hasError: boolean | string | null) => {
      if (typeof hasError === 'boolean') {
        setScannerError(hasError ? "حدث خطأ غير محدد" : null);
      } else {
        setScannerError(hasError);
      }
    },
    activateCamera: async () => {
      return await startScan();
    },
    startScan
  });

  // فحص وطلب أذونات الكاميرا
  const checkPermissions = useCallback(async () => {
    try {
      console.log('[useZXingBarcodeScanner] التحقق من أذونات الكاميرا');
      setIsLoading(true);

      const permissionResult = await scannerPermissionService.checkPermission();
      console.log(`[useZXingBarcodeScanner] نتيجة فحص الإذن:`, permissionResult);
      setHasPermission(permissionResult);

      if (permissionResult && autoStart) {
        console.log('[useZXingBarcodeScanner] الأذونات موجودة، بدء المسح التلقائي');
        
        // محاولة بدء المسح مع تأخير قصير للتأكد من استقرار حالة الإذن
        setTimeout(async () => {
          try {
            const success = await startScan();
            console.log('[useZXingBarcodeScanner] نتيجة بدء المسح:', success);
            
            if (!success && attempts < 3) {
              console.warn('[useZXingBarcodeScanner] فشل بدء المسح، محاولة مرة أخرى...');
              setAttempts(prev => prev + 1);
              
              setTimeout(() => {
                startScan().catch(e => console.error('[useZXingBarcodeScanner] خطأ في إعادة محاولة المسح:', e));
              }, 1000);
            }
          } catch (e) {
            console.error('[useZXingBarcodeScanner] خطأ في بدء المسح:', e);
          }
        }, 500);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('[useZXingBarcodeScanner] خطأ في التحقق من الأذونات:', error);
      setScannerError('خطأ في التحقق من أذونات الكاميرا');
      setIsLoading(false);
    }
  }, [autoStart, startScan, attempts]);

  // طلب الأذونات
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useZXingBarcodeScanner] طلب إذن الكاميرا');
      setIsLoading(true);

      const granted = await scannerPermissionService.requestPermission();
      console.log(`[useZXingBarcodeScanner] نتيجة طلب الإذن:`, granted);
      
      setHasPermission(granted);
      setIsLoading(false);
      
      if (granted && autoStart) {
        console.log('[useZXingBarcodeScanner] تم منح الإذن، بدء المسح');
        
        // محاولة بدء المسح مع تأخير قصير للتأكد من استقرار حالة الإذن
        setTimeout(async () => {
          const started = await startScan();
          console.log('[useZXingBarcodeScanner] نتيجة بدء المسح بعد منح الإذن:', started);
          
          // محاولة مرة أخرى بعد تأخير أطول إذا فشلت المحاولة الأولى
          if (!started) {
            console.warn('[useZXingBarcodeScanner] فشل بدء المسح، محاولة مرة أخرى بعد تأخير');
            setTimeout(() => {
              startScan().catch(e => console.error('[useZXingBarcodeScanner] خطأ في إعادة محاولة المسح:', e));
            }, 1500);
          }
        }, 500);
      }
      
      return granted;
    } catch (error) {
      console.error('[useZXingBarcodeScanner] خطأ في طلب الإذن:', error);
      setScannerError('خطأ في طلب إذن الكاميرا');
      setIsLoading(false);
      return false;
    }
  }, [autoStart, startScan]);

  // فتح إعدادات التطبيق
  const openAppSettings = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useZXingBarcodeScanner] فتح إعدادات التطبيق');
      return await scannerPermissionService.openAppSettings();
    } catch (error) {
      console.error('[useZXingBarcodeScanner] خطأ في فتح الإعدادات:', error);
      return false;
    }
  }, []);

  // فحص الأذونات عند تحميل المكون
  useEffect(() => {
    checkPermissions();
    
    // تنظيف عند إلغاء تحميل المكون
    return () => {
      stopScan().catch(e => console.error('[useZXingBarcodeScanner] خطأ في إيقاف المسح عند التنظيف:', e));
    };
  }, []);

  return {
    isLoading,
    hasPermission,
    cameraActive,
    setCameraActive, 
    isScanningActive,
    scannerError,
    hasScannerError, 
    requestPermission: async () => {
      // Implementation of requestPermission
      try {
        const granted = await scannerPermissionService.requestPermission();
        setHasPermission(granted);
        return granted;
      } catch (error) {
        console.error("Error requesting permission:", error);
        return false;
      }
    },
    handleRetry,
    openAppSettings: async () => {
      // Implementation of openAppSettings
      return false; // Placeholder implementation
    },
    startScan
  };
};
