
import { useState, useEffect, useCallback } from 'react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { useScannerActivation } from './modules/useScannerActivation';
import { useScannerPermission } from './modules/useScannerPermission';
import { Toast } from '@capacitor/toast';

interface UseZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

export const useZXingBarcodeScanner = ({
  onScan,
  onClose,
  autoStart = true
}: UseZXingBarcodeScannerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [hasScannerError, setHasScannerError] = useState(false);

  // كائن لاستدعاء دالة المسح خارج امتداد الوقت
  const scanCallbackRef = useCallback(onScan, [onScan]);

  // إعداد دوال معالجة الماسح الضوئي
  const handleOnScanSuccess = useCallback((code: string) => {
    console.log("ZXing: تم المسح بنجاح:", code);
    scanCallbackRef(code);
  }, [scanCallbackRef]);
  
  const handleError = useCallback((error: string) => {
    console.error("ZXing: خطأ:", error);
    setHasScannerError(true);
    Toast.show({
      text: `خطأ: ${error}`,
      duration: 'long',
    });
  }, []);

  const handleStart = useCallback(() => {
    console.log("ZXing: بدء تشغيل الماسح");
    setCameraActive(true);
  }, []);

  const handleStop = useCallback(() => {
    console.log("ZXing: إيقاف الماسح");
    setCameraActive(false);
  }, []);

  // استخدام هوك تنشيط الماسح
  const { requestCamera, stopCamera } = useScannerActivation({
    onStart: handleStart,
    onStop: handleStop,
    onError: handleError
  });
  
  // استخدام هوك أذونات الماسح
  const { checkPermissions } = useScannerPermission(
    setIsLoading,
    setHasPermission,
    setHasScannerError
  );

  // التحقق من أذونات الماسح الضوئي عند تحميل المكون
  useEffect(() => {
    console.log("ZXing: تهيئة الماسح الضوئي، autoStart =", autoStart);
    
    const initScanner = async () => {
      await checkPermissions(autoStart, requestCamera);
    };
    
    initScanner();
    
    // تنظيف عند إلغاء تحميل المكون
    return () => {
      console.log("ZXing: تنظيف الماسح الضوئي");
      stopCamera();
    };
  }, [autoStart, checkPermissions, requestCamera, stopCamera]);

  // طلب الإذن بشكل صريح
  const requestPermission = useCallback(async () => {
    console.log("ZXing: طلب إذن الماسح الضوئي");
    setIsLoading(true);
    
    try {
      const permission = await scannerPermissionService.requestPermission();
      console.log("ZXing: نتيجة طلب الإذن:", permission);
      
      setHasPermission(permission);
      
      if (permission) {
        // بدء المسح بشكل تلقائي إذا تم منح الإذن
        await requestCamera();
      }
      
      setIsLoading(false);
      return permission;
    } catch (error) {
      console.error("ZXing: خطأ في طلب الإذن:", error);
      setHasPermission(false);
      setHasScannerError(true);
      setIsLoading(false);
      return false;
    }
  }, [requestCamera]);

  // إعادة المحاولة في حالة وجود أخطاء
  const handleRetry = useCallback(async () => {
    console.log("ZXing: إعادة المحاولة");
    setIsLoading(true);
    setHasScannerError(false);
    
    // إيقاف الماسح أولاً
    stopCamera();
    
    try {
      // التحقق من الإذن مرة أخرى
      const hasPermission = await scannerPermissionService.checkPermission();
      setHasPermission(hasPermission);
      
      if (hasPermission) {
        // محاولة إعادة تشغيل الماسح
        await requestCamera();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("ZXing: خطأ في إعادة المحاولة:", error);
      setHasScannerError(true);
      setIsLoading(false);
    }
  }, [requestCamera, stopCamera]);

  return {
    isLoading,
    hasPermission,
    hasScannerError, 
    cameraActive,
    requestPermission,
    handleRetry,
  };
};
