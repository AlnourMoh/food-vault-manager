
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { useMLKitScanner } from './providers/useMLKitScanner';
import { useScannerUI } from './useScannerUI';

interface UseScannerStateProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useScannerState = ({ onScan, onClose }: UseScannerStateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  
  const { hasPermission, requestPermission } = useCameraPermissions();
  const { isScanning, startMLKitScan, stopMLKitScan } = useMLKitScanner();
  const { setupScannerBackground, restoreUIAfterScanning, cleanup } = useScannerUI();
  
  const { toast } = useToast();
  
  // بدء المسح
  const startScan = useCallback(async () => {
    try {
      console.log('[useScannerState] بدء المسح...');
      setIsLoading(true);
      
      // التحقق من الأذونات وطلبها إذا لزم الأمر
      if (hasPermission === false) {
        const granted = await requestPermission();
        if (!granted) {
          console.log('[useScannerState] لم يتم منح إذن الكاميرا');
          setIsLoading(false);
          return false;
        }
      }
      
      // إعداد الواجهة للمسح
      await setupScannerBackground();
      setIsScanningActive(true);
      setIsLoading(false);
      
      // بدء المسح
      const success = await startMLKitScan((code) => {
        console.log('[useScannerState] تم المسح بنجاح:', code);
        setLastScannedCode(code);
        onScan(code);
      });
      
      if (!success) {
        console.log('[useScannerState] فشل المسح');
        stopScan();
        setHasScannerError(true);
      }
      
      return success;
    } catch (error) {
      console.error('[useScannerState] خطأ في بدء المسح:', error);
      setIsLoading(false);
      stopScan();
      setHasScannerError(true);
      return false;
    }
  }, [hasPermission, requestPermission, onScan, setupScannerBackground, startMLKitScan, stopMLKitScan]);

  // إيقاف المسح
  const stopScan = useCallback(async () => {
    try {
      console.log('[useScannerState] إيقاف المسح...');
      setIsScanningActive(false);
      
      // إيقاف المسح في MLKit
      await stopMLKitScan();
      
      // تنظيف واجهة المستخدم
      await restoreUIAfterScanning();
      
      return true;
    } catch (error) {
      console.error('[useScannerState] خطأ في إيقاف المسح:', error);
      return false;
    }
  }, [stopMLKitScan, restoreUIAfterScanning]);

  // وظيفة للتعامل مع الإدخال اليدوي
  const handleManualEntry = useCallback(() => {
    setIsManualEntry(true);
    stopScan();
  }, [stopScan]);

  // وظيفة لإلغاء الإدخال اليدوي
  const handleManualCancel = useCallback(() => {
    setIsManualEntry(false);
  }, []);

  // وظيفة لإعادة المحاولة بعد الخطأ
  const handleRetry = useCallback(() => {
    setHasScannerError(false);
    startScan();
  }, [startScan]);

  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log('[useScannerState] تنظيف المكون...');
      stopScan().catch(e => 
        console.error('[useScannerState] خطأ في إيقاف المسح عند التنظيف:', e)
      );
    };
  }, [stopScan]);

  return {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    isManualEntry,
    hasScannerError,
    startScan,
    stopScan,
    requestPermission,
    handleManualEntry,
    handleManualCancel,
    handleRetry
  };
};
