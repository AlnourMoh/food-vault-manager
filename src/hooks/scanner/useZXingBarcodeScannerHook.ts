
import { useState, useEffect } from 'react';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import { useScannerPermission } from './modules/useScannerPermission';
import { useBarcodeScanning } from './modules/useBarcodeScanning';
import { useScannerActivation } from './modules/useScannerActivation';
import { useScannerRetry } from './modules/useScannerRetry';

interface UseZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

export const useZXingBarcodeScannerHook = ({ 
  onScan, 
  onClose, 
  autoStart = true 
}: UseZXingBarcodeScannerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  
  // Use the scanner permission hook
  const { checkPermissions, requestPermission } = useScannerPermission(
    setIsLoading,
    setHasPermission,
    (error) => setScannerError(error ? "حدث خطأ في الماسح الضوئي" : null)
  );
  
  // Use the barcode scanning hook
  const { startScan, stopScan } = useBarcodeScanning({
    onScan,
    isScanningActive,
    setIsScanningActive,
    cameraActive,
    hasScannerError: !!scannerError,
    setHasScannerError: (error) => setScannerError(error ? "حدث خطأ في الماسح الضوئي" : null)
  });
  
  // Use the scanner activation hook
  const { activateCamera } = useScannerActivation({
    cameraActive,
    setCameraActive,
    hasPermission,
    setIsLoading,
    setHasScannerError: (error) => setScannerError(error ? "حدث خطأ في تفعيل الكاميرا" : null),
    requestPermission,
    startScan
  });
  
  // Use the scanner retry hook
  const { handleRetry } = useScannerRetry({
    setHasScannerError: (error) => setScannerError(error ? "حدث خطأ في الماسح الضوئي" : null),
    setCameraActive,
    activateCamera,
    startScan
  });
  
  // فحص الأذونات عند تحميل المكون
  useEffect(() => {
    const checkPermission = async () => {
      await checkPermissions(autoStart, activateCamera);
    };
    
    checkPermission();
  }, [autoStart, checkPermissions, activateCamera]);
  
  // تنظيف الموارد عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log("useZXingBarcodeScannerHook: تنظيف موارد الماسح عند الإلغاء");
      
      // إيقاف المسح إذا كان نشطًا
      if (isScanningActive) {
        stopScan().catch(error => {
          console.error("useZXingBarcodeScannerHook: خطأ في إيقاف المسح:", error);
        });
      }
      
      // إزالة جميع المستمعين
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        BarcodeScanner.removeAllListeners().catch(error => {
          console.error("useZXingBarcodeScannerHook: خطأ في إزالة المستمعين:", error);
        });
      }
    };
  }, [isScanningActive, stopScan]);

  return {
    isLoading,
    hasPermission,
    cameraActive,
    scannerError,
    requestPermission,
    handleRetry
  };
};
