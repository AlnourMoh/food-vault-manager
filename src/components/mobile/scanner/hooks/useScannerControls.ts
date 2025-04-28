
import { useState, useEffect } from 'react';
import { useScannerState } from '@/hooks/scanner/useScannerState';
import { useMockScanner } from '@/hooks/scanner/useMockScanner';
import { useToast } from '@/hooks/use-toast';

interface UseScannerControlsProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useScannerControls = ({ onScan, onClose }: UseScannerControlsProps) => {
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  const { toast } = useToast();
  
  const {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan: _startScan,
    stopScan: _stopScan
  } = useScannerState({ 
    onScan, 
    onClose 
  });

  const {
    startMockScan,
    isMockScanActive,
    handleManualInput,
    cancelMockScan
  } = useMockScanner();

  // تخزين مرجع للماسح النشط
  const [isActive, setIsActive] = useState(false);

  // تنظيف أي حالة نشطة عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log('[useScannerControls] تنظيف الموارد عند إلغاء التحميل');
      
      if (isActive) {
        stopScan();
      }
      
      if (isManualEntry) {
        cancelMockScan();
      }
    };
  }, [isActive, isManualEntry]);

  // وظيفة بدء المسح مع تحسين إدارة الحالة
  const startScan = async () => {
    try {
      console.log('[useScannerControls] بدء المسح');
      setIsActive(true);
      return await _startScan();
    } catch (error) {
      console.error('[useScannerControls] خطأ عند بدء المسح:', error);
      setHasScannerError(true);
      setIsActive(false);
      return false;
    }
  };

  // وظيفة إيقاف المسح مع تحسين إدارة الحالة
  const stopScan = async () => {
    try {
      console.log('[useScannerControls] إيقاف المسح');
      setIsActive(false);
      return await _stopScan();
    } catch (error) {
      console.error('[useScannerControls] خطأ عند إيقاف المسح:', error);
      return false;
    }
  };

  const handleManualEntry = () => {
    console.log('[Scanner] التحويل إلى إدخال الكود يدويًا');
    try {
      // إيقاف المسح الحالي أولاً إذا كان نشطًا
      if (isActive) {
        stopScan();
      }
    } catch (error) {
      console.error('[Scanner] خطأ عند إيقاف المسح:', error);
    }
    
    setIsManualEntry(true);
    startMockScan(onScan);
  };

  const handleManualCancel = () => {
    console.log('[Scanner] تم إلغاء الإدخال اليدوي');
    cancelMockScan();
    setIsManualEntry(false);
  };

  const handleRetry = () => {
    console.log('[Scanner] إعادة المحاولة بعد خطأ');
    setHasScannerError(false);
    
    // إنتظار لحظة قبل إعادة المحاولة
    setTimeout(() => {
      try {
        startScan().catch(error => {
          console.error('[useScannerControls] خطأ في محاولة إعادة المسح:', error);
          setHasScannerError(true);
          // في حالة فشل المحاولة مجددًا، انتقل إلى الإدخال اليدوي مباشرة
          handleManualEntry();
        });
      } catch (error) {
        console.error('[useScannerControls] خطأ غير متوقع عند إعادة المحاولة:', error);
        setHasScannerError(true);
        handleManualEntry();
      }
    }, 500);
  };

  return {
    isManualEntry,
    hasScannerError,
    setHasScannerError,
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan,
    handleManualEntry,
    handleManualCancel,
    handleRetry,
    isMockScanActive,
    handleManualInput
  };
};
