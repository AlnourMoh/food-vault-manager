
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
    startScan,
    stopScan
  } = useScannerState({ onScan, onClose });

  const {
    startMockScan,
    isMockScanActive,
    handleManualInput,
    cancelMockScan
  } = useMockScanner();

  // تنظيف أي حالة نشطة عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log('[useScannerControls] تنظيف الموارد عند إلغاء التحميل');
      try {
        stopScan();
        cancelMockScan();
      } catch (error) {
        console.error('[useScannerControls] خطأ أثناء تنظيف الموارد:', error);
      }
    };
  }, []);

  // تجنب تشغيل المسح التلقائي، دع المستخدم يبدأ المسح يدوياً
  // للتأكد من أن الأذونات وتهيئة العرض تتم بشكل صحيح
  
  const handleManualEntry = () => {
    console.log('[Scanner] التحويل إلى إدخال الكود يدويًا');
    try {
      stopScan();
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
    // إنتظر لحظة قبل إعادة المحاولة
    setTimeout(() => {
      try {
        startScan().catch(error => {
          console.error('[useScannerControls] خطأ في محاولة إعادة المسح:', error);
          setHasScannerError(true);
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
