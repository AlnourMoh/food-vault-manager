
import { useState, useEffect, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { useToast } from '@/hooks/use-toast';
import { useScannerPermission } from './modules/useScannerPermission';
import { useScannerOperations } from './modules/useScannerOperations';
import { useScannerUI } from './modules/useScannerUI';

/**
 * هوك للتعامل مع الماسح الضوئي MLKit
 */
export const useMLKitScanner = (
  onScan?: (code: string) => void,
  onClose?: () => void,
  autoStart: boolean = false
) => {
  const [isNativePlatform, setIsNativePlatform] = useState<boolean>(false);
  const [platformSupported, setPlatformSupported] = useState<boolean | null>(null);
  
  const { toast } = useToast();
  const mountedRef = useRef<boolean>(true);
  
  // استخدام الهوك الفرعية
  const {
    isLoading,
    setIsLoading,
    hasPermission,
    setHasPermission,
    requestPermission,
    checkSupportAndPermission
  } = useScannerPermission();
  
  const {
    isScanningActive,
    setIsScanningActive,
    lastScannedCode,
    setLastScannedCode,
    hasScannerError,
    setHasScannerError,
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

  // التحقق من دعم المنصة
  useEffect(() => {
    const checkPlatform = async () => {
      try {
        // تحديد ما إذا كنا في منصة أصلية
        const isNative = Capacitor.isNativePlatform();
        setIsNativePlatform(isNative);
        
        // التحقق من دعم الملحق
        const supported = isNative && Capacitor.isPluginAvailable('MLKitBarcodeScanner');
        setPlatformSupported(supported);
        
        // إذا كانت المنصة مدعومة، تحقق من الأذونات
        if (supported && mountedRef.current) {
          await checkSupportAndPermission();
          
          // بدء المسح تلقائيًا إذا تم منح الإذن وتم تفعيل خيار البدء التلقائي
          if (hasPermission && autoStart && mountedRef.current) {
            handleStartScan();
          }
        }
      } catch (error) {
        console.error('[useMLKitScanner] خطأ في التحقق من المنصة:', error);
        setPlatformSupported(false);
      }
    };
    
    checkPlatform();
    
    return () => {
      mountedRef.current = false;
      handleStopScan().catch(console.error);
    };
  }, []);

  // بدء المسح تلقائيًا عند منح الإذن
  useEffect(() => {
    if (hasPermission && autoStart && platformSupported && mountedRef.current) {
      handleStartScan();
    }
  }, [hasPermission, autoStart, platformSupported]);

  /**
   * بدء عملية المسح
   */
  const handleStartScan = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // التحقق من إذن الكاميرا
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) return false;
      }
      
      // إعداد واجهة المستخدم
      await setupScannerBackground();
      
      if (!mountedRef.current) return false;
      
      // بدء عملية المسح
      return await startScan(true, async () => true);
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في بدء المسح:', error);
      return false;
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [hasPermission, requestPermission, setupScannerBackground, startScan]);

  /**
   * إيقاف عملية المسح
   */
  const handleStopScan = useCallback(async (): Promise<boolean> => {
    try {
      await stopScan();
      await restoreUIAfterScanning();
      return true;
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في إيقاف المسح:', error);
      return false;
    }
  }, [stopScan, restoreUIAfterScanning]);

  /**
   * إعادة المحاولة بعد الخطأ
   */
  const handleRetry = useCallback(() => {
    setHasScannerError(false);
    handleStartScan();
  }, [handleStartScan]);

  return {
    isLoading,
    hasPermission,
    isNativePlatform,
    platformSupported,
    isScanningActive,
    lastScannedCode,
    isManualEntry,
    hasScannerError,
    handleStartScan,
    handleStopScan,
    requestPermission,
    handleManualEntry,
    handleManualCancel,
    handleRetry,
    scanFromImage
  };
};
