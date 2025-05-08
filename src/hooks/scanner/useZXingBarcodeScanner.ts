
import { useState, useEffect, useRef } from 'react';
import { useScannerPermissions } from './hooks/useScannerPermissions';
import { useCameraActivation } from './hooks/useCameraActivation';
import { useScanOperations } from './hooks/useScanOperations';
import { useBarcodeDetection } from './hooks/useBarcodeDetection';

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
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  
  // Composite hooks
  const { isLoading, hasPermission, requestPermission } = useScannerPermissions();
  const { cameraActive, hasScannerError, activateCamera, setCameraActive, setHasScannerError } = useCameraActivation();
  const { startScan, stopScan, handleRetry } = useScanOperations(
    cameraActive, 
    activateCamera, 
    setIsScanningActive, 
    setHasScannerError,
    setCameraActive
  );
  
  // Setup barcode detection
  useBarcodeDetection(onScan, stopScan, isScanningActive, hasScannerError, cameraActive);
  
  // تهيئة المسح الضوئي تلقائيًا عند تحميل المكون
  useEffect(() => {
    const initializeScanner = async () => {
      console.log('[useZXingBarcodeScanner] تهيئة الماسح وفحص الأذونات...');

      try {
        // محاولة طلب الأذونات وتفعيل الكاميرا
        
        // طلب الأذونات فوراً
        const permissionGranted = await requestPermission();
        
        if (permissionGranted && autoStart) {
          // تفعيل الكاميرا أولاً قبل بدء المسح
          await activateCamera();
          
          // بدء المسح مباشرة إذا تم منح الإذن
          console.log('[useZXingBarcodeScanner] بدء المسح تلقائياً...');
          await startScan();
        }
      } catch (error) {
        console.error('[useZXingBarcodeScanner] خطأ في تهيئة الماسح:', error);
        setHasScannerError(true);
      }
    };

    // تشغيل الماسح مباشرة عند التحميل
    initializeScanner();

    // عند إلغاء تحميل المكون، نتأكد من إيقاف المسح
    return () => {
      stopScan();
    };
  }, [autoStart, requestPermission, activateCamera, startScan, stopScan]);
  
  return {
    isLoading,
    hasPermission,
    isScanningActive,
    hasScannerError,
    cameraActive,
    startScan,
    stopScan,
    requestPermission,
    handleRetry
  };
};
