
import { useState, useEffect } from 'react';
import { useScannerState } from '@/hooks/scanner/useScannerState';
import { useMockScanner } from '@/hooks/scanner/useMockScanner';
import { useToast } from '@/hooks/use-toast';
import { useScannerPermissions } from '@/hooks/scanner/hooks/useScannerPermissions';

interface UseScannerControlsProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useScannerControls = ({ onScan, onClose }: UseScannerControlsProps) => {
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const { toast } = useToast();
  
  // Get scanner permissions
  const { requestPermission } = useScannerPermissions();
  
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
      
      try {
        if (isActive) {
          stopScan().catch(e => {
            console.error('[useScannerControls] خطأ في إيقاف المسح عند التنظيف:', e);
          });
        }
        
        if (isManualEntry) {
          cancelMockScan();
        }
      } catch (error) {
        console.error('[useScannerControls] خطأ غير متوقع أثناء التنظيف:', error);
      }
    };
  }, [isActive, isManualEntry]);

  // تأكيد تحديث حالة الكاميرا عند تغير حالة المسح
  useEffect(() => {
    if (isScanningActive) {
      setCameraActive(true);
    }
  }, [isScanningActive]);

  // وظيفة بدء المسح محسنة مع تعزيز الاعتمادية
  const startScan = async () => {
    try {
      console.log('[useScannerControls] بدء المسح...');
      setIsActive(true);
      setCameraActive(true);
      
      // محاولة بدء المسح مباشرة
      return await _startScan().catch(async error => {
        console.error('[useScannerControls] خطأ في المحاولة الأولى للمسح:', error);
        
        // يونس صغير للسماح بتهدئة الموارد
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // محاولة ثانية بعد تأخير قصير
        console.log('[useScannerControls] محاولة ثانية للمسح بعد تأخير قصير');
        return await _startScan();
      });
    } catch (error) {
      console.error('[useScannerControls] خطأ غير متوقع عند بدء المسح:', error);
      setHasScannerError(true);
      setIsActive(false);
      return false;
    }
  };

  // وظيفة إيقاف المسح بشكل آمن
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
      if (isActive) {
        stopScan().catch(error => {
          console.error('[Scanner] خطأ عند إيقاف المسح قبل الإدخال اليدوي:', error);
        });
      }
      
      setIsManualEntry(true);
      startMockScan(onScan);
    } catch (error) {
      console.error('[Scanner] خطأ غير متوقع عند التحويل للإدخال اليدوي:', error);
      setIsManualEntry(true);
      startMockScan(onScan);
    }
  };

  const handleManualCancel = () => {
    console.log('[Scanner] تم إلغاء الإدخال اليدوي');
    cancelMockScan();
    setIsManualEntry(false);
  };

  const handleRetry = () => {
    console.log('[Scanner] إعادة المحاولة بعد خطأ');
    setHasScannerError(false);
    
    startScan().catch(error => {
      console.error('[useScannerControls] خطأ في محاولة إعادة المسح:', error);
      setHasScannerError(true);
      // في حالة فشل المحاولة مجددًا، انتقل إلى الإدخال اليدوي
      handleManualEntry();
    });
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
    handleManualInput,
    requestPermission,
    cameraActive,
    setCameraActive
  };
};
