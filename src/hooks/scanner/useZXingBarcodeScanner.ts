
import { useState, useCallback, useEffect } from 'react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { useScannerCleanup } from './modules/useScannerCleanup';
import { useScannerPermission } from './modules/useScannerPermission';
import { useBarcodeScanning } from './modules/useBarcodeScanning';
import { useScannerActivation } from './modules/useScannerActivation';
import { useScannerRetry } from './modules/useScannerRetry';

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
  
  // للتسجيل عند بدء الاستخدام
  useEffect(() => {
    console.log('useZXingBarcodeScanner: تهيئة الماسح الضوئي مع الإعدادات', {
      autoStart,
    });
  }, [autoStart]);
  
  // استخدام مكونات أصغر لإدارة المسح
  const { startScan, stopScan } = useBarcodeScanning({
    onScan,
    isScanningActive,
    setIsScanningActive,
    cameraActive,
    hasScannerError,
    setHasScannerError
  });
  
  // استخدام مكون منفصل للتحقق من الأذونات
  const { checkPermissions, requestPermission } = useScannerPermission(
    setIsLoading,
    setHasPermission,
    setHasScannerError
  );
  
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
      console.log('useZXingBarcodeScanner: بدء التحقق من الأذونات');
      await checkPermissions(autoStart, activateCamera);
      console.log('useZXingBarcodeScanner: انتهى التحقق من الأذونات');
    };
    
    initPermissions();
  }, [autoStart, checkPermissions, activateCamera]);
  
  // للتسجيل عند تغيير الحالات
  useEffect(() => {
    console.log('useZXingBarcodeScanner: تحديث الحالات', {
      isLoading,
      hasPermission,
      isScanningActive,
      cameraActive,
      hasScannerError
    });
  }, [isLoading, hasPermission, isScanningActive, cameraActive, hasScannerError]);
  
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
