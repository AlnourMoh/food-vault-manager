
import { useState, useCallback, useEffect } from 'react';
import { useScannerPermission } from './modules/useScannerPermission';
import { useBarcodeScanning } from './modules/useBarcodeScanning';
import { useScannerActivation } from './modules/useScannerActivation';
import { useScannerRetry } from './modules/useScannerRetry';
import { useScannerCleanup } from './modules/useScannerCleanup';

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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  
  // استخدام مكون منفصل للتحقق من الأذونات
  const { checkPermissions, requestPermission } = useScannerPermission(
    setIsLoading,
    setHasPermission,
    setHasScannerError
  );
  
  // استخدام مكونات أصغر لإدارة المسح
  const { startScan, stopScan } = useBarcodeScanning({
    onScan,
    isScanningActive,
    setIsScanningActive,
    cameraActive,
    hasScannerError,
    setHasScannerError
  });
  
  // استخدام مكون منفصل لتفعيل الكاميرا
  const { activateCamera } = useScannerActivation({
    cameraActive,
    setCameraActive,
    hasPermission,
    setIsLoading,
    setHasScannerError,
    requestPermission,
    startScan
  });
  
  // استخدام مكون منفصل لمعالجة إعادة المحاولة
  const { handleRetry } = useScannerRetry({
    setHasScannerError,
    setCameraActive,
    activateCamera,
    startScan
  });
  
  // التحقق من الأذونات عند تحميل المكون
  useEffect(() => {
    const initPermissions = async () => {
      await checkPermissions(autoStart, activateCamera);
    };
    
    initPermissions();
  }, [autoStart, checkPermissions, activateCamera]);
  
  // استخدام hook للتنظيف عند إلغاء تحميل المكون
  useScannerCleanup(isScanningActive, stopScan);
  
  return {
    isLoading,
    hasPermission,
    isScanningActive,
    cameraActive,
    hasScannerError,
    startScan,
    stopScan,
    activateCamera,
    requestPermission,
    handleRetry
  };
};
