
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

  const { 
    cameraActive,
    startScan,
    stopScan,
    setCameraActive,
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

  const { handleRetry } = useScannerRetry({
    setHasScannerError: setScannerError,
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
      
      setIsLoading(false);
    } catch (error) {
      console.error('[useZXingBarcodeScanner] خطأ في التحقق من الأذونات:', error);
      setScannerError('خطأ في التحقق من أذونات الكاميرا');
      setIsLoading(false);
    }
  }, [autoStart, startScan]);

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
        await startScan();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    hasPermission,
    cameraActive,
    scannerError,
    requestPermission,
    handleRetry,
    openAppSettings
  };
};
