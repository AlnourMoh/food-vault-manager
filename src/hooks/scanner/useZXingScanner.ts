
import { useRef, useEffect } from 'react';
import { useScannerPermission } from './modules/useScannerPermission';
import { useScannerOperations } from './modules/useScannerOperations';
import { useScannerUI } from './modules/useScannerUI';

interface UseZXingScannerProps {
  onScan?: (code: string) => void;
  onClose?: () => void;
  autoStart?: boolean;
}

/**
 * هوك رئيسي للماسح الضوئي ZXing
 */
export const useZXingScanner = ({ 
  onScan, 
  onClose, 
  autoStart = false 
}: UseZXingScannerProps = {}) => {
  // استخدام الهوك الفرعية
  const {
    isLoading,
    setIsLoading,
    hasPermission,
    requestPermission,
    checkSupportAndPermission
  } = useScannerPermission();
  
  const {
    isScanningActive,
    lastScannedCode,
    hasScannerError,
    startScan,
    stopScan,
    scanFromImage
  } = useScannerOperations(onScan);
  
  const {
    isManualEntry,
    setupScannerBackground,
    restoreUIAfterScanning,
    handleManualEntry,
    handleManualCancel
  } = useScannerUI();
  
  const isMountedRef = useRef(true);
  
  // التحقق من الحالة عند التحميل وبدء المسح تلقائياً إذا تم تفعيل الخيار
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        
        // التحقق من الدعم والإذن
        const hasPermissionGranted = await checkSupportAndPermission();
        
        // بدء المسح تلقائياً إذا تم منح الإذن وتم تفعيل خيار البدء التلقائي
        if (hasPermissionGranted && autoStart && isMountedRef.current) {
          console.log('[useZXingScanner] تم منح الإذن، بدء المسح تلقائياً...');
          await startScanHandler();
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };
    
    initialize();
    
    // التنظيف عند إلغاء تحميل المكون
    return () => {
      isMountedRef.current = false;
      stopScanHandler();
    };
  }, [autoStart]);

  /**
   * بدء المسح - وظيفة مساعدة لتنسيق العمليات المطلوبة
   */
  const startScanHandler = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // إعداد واجهة المستخدم
      await setupScannerBackground();
      
      if (!isMountedRef.current) return false;
      
      // بدء عملية المسح
      return await startScan(hasPermission, requestPermission);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  /**
   * إيقاف المسح - وظيفة مساعدة لتنسيق العمليات المطلوبة
   */
  const stopScanHandler = async (): Promise<void> => {
    await stopScan();
    await restoreUIAfterScanning();
  };

  /**
   * إعادة المحاولة بعد الخطأ
   */
  const handleRetry = () => {
    startScanHandler();
  };

  return {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    isManualEntry,
    hasScannerError,
    startScan: startScanHandler,
    stopScan: stopScanHandler,
    requestPermission,
    handleManualEntry,
    handleManualCancel,
    handleRetry,
    scanFromImage
  };
};
