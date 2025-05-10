
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

export const useZXingBarcodeScannerHook = ({ 
  onScan, 
  onClose, 
  autoStart = true 
}: UseZXingBarcodeScannerOptions) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [hasScannerError, setHasScannerError] = useState<string | null>(null);

  const { 
    cameraActive,
    startScan,
    stopScan,
    setCameraActive,
  } = useBarcodeScanning({
    onScan,
    onScanError: (error: string) => {
      console.error(`[useZXingBarcodeScanner] خطأ في المسح:`, error);
      setHasScannerError(`خطأ في المسح: ${error}`);
    },
    onScanComplete: () => {
      console.log('[useZXingBarcodeScanner] اكتمل المسح');
      // إغلاق الماسح بعد المسح إذا لزم الأمر
      onClose();
    }
  });

  const { handleRetry } = useScannerRetry({
    setHasScannerError,
    setCameraActive,
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
        await startScan();
      }
    } catch (error) {
      console.error('[useZXingBarcodeScanner] خطأ في التحقق من الأذونات:', error);
      setHasScannerError('خطأ في التحقق من أذونات الكاميرا');
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, [autoStart, startScan]);

  // طلب إذن الكاميرا
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useZXingBarcodeScanner] طلب إذن الكاميرا');
      setIsLoading(true);

      const granted = await scannerPermissionService.requestPermission();
      console.log(`[useZXingBarcodeScanner] نتيجة طلب الإذن:`, granted);
      setHasPermission(granted);

      if (granted && autoStart) {
        console.log('[useZXingBarcodeScanner] تم منح الإذن، بدء المسح');
        await startScan();
      }

      setIsLoading(false);
      return granted;
    } catch (error) {
      console.error('[useZXingBarcodeScanner] خطأ في طلب الإذن:', error);
      setHasScannerError('خطأ في طلب إذن الكاميرا');
      setHasPermission(false);
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

  // التهيئة الأولية وتنظيف الموارد
  useEffect(() => {
    console.log('[useZXingBarcodeScanner] بدء التهيئة');
    checkPermissions();

    return () => {
      console.log('[useZXingBarcodeScanner] تنظيف الموارد');
      stopScan().catch(err => console.error('[useZXingBarcodeScanner] خطأ في إيقاف المسح أثناء التنظيف:', err));
    };
  }, [checkPermissions, stopScan]);

  return {
    isLoading,
    hasPermission,
    cameraActive,
    scannerError: hasScannerError,
    requestPermission,
    handleRetry,
    openAppSettings
  };
};

export { useZXingBarcodeScannerHook as useZXingBarcodeScanner };
