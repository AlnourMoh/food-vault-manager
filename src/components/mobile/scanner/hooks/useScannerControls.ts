import { useState, useEffect } from 'react';
import { useScannerState, UseScannerStateProps } from '@/hooks/scanner/useScannerState';
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
  
  // Use scanner state with the props we have available
  const {
    isLoading,
    hasPermission,
    isScanning: isScanningActive,
    lastScannedCode,
    startScan: _startScan,
    stopScan: _stopScan
  } = useScannerState({ 
    onScan, 
    onClose,
    autoStart: true 
  });

  const { requestPermission } = useScannerPermissions();

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

  // تفعيل الكاميرا تلقائيًا عند التحميل
  useEffect(() => {
    if (!cameraActive && !isLoading) {
      console.log('[useScannerControls] تفعيل الكاميرا تلقائيًا عند التحميل');
      setCameraActive(true);
    }
  }, [cameraActive, isLoading]);

  // تحديث حالة الكاميرا عند تغير حالة المسح
  useEffect(() => {
    if (isScanningActive && !cameraActive) {
      setCameraActive(true);
    }
  }, [isScanningActive, cameraActive]);

  // تبسيط بدء المسح بأقل فرص للأخطاء
  const startScan = async () => {
    try {
      console.log('[useScannerControls] بدء المسح بالطريقة المبسطة...');
      setIsActive(true);
      setCameraActive(true);
      
      // كان هناك مشكلة سابقة في تسلسل التنفيذ، الآن نضمن التسلسل الصحيح
      const success = await _startScan();
      
      if (!success) {
        console.log('[useScannerControls] فشل بدء المسح، محاولة مرة أخرى بتأخير قصير');
        // محاولة ثانية بعد فترة قصيرة
        setTimeout(async () => {
          await _startScan().catch(error => {
            console.error('[useScannerControls] فشل في المحاولة الثانية:', error);
          });
        }, 500);
      }
      
      return success;
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
      // إضافة تأخير قصير قبل إيقاف الكاميرا لتفادي التحولات المرئية المفاجئة
      setTimeout(() => setCameraActive(false), 100);
      return await _stopScan();
    } catch (error) {
      console.error('[useScannerControls] خطأ عند إيقاف المسح:', error);
      setCameraActive(false); // تأكيد إيقاف الكاميرا حتى في حالة الخطأ
      return false;
    }
  };

  // تبسيط الانتقال للإدخال اليدوي
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
      console.error('[Scanner] خطأ عند التحويل للإدخال اليدوي:', error);
      setIsManualEntry(true);
      startMockScan(onScan);
    }
  };

  const handleManualCancel = () => {
    console.log('[Scanner] تم إلغاء الإدخال اليدوي');
    cancelMockScan();
    setIsManualEntry(false);
  };

  // تبسيط إعادة المحاولة
  const handleRetry = () => {
    console.log('[Scanner] إعادة المحاولة بعد خطأ');
    setHasScannerError(false);
    setCameraActive(true);
    
    // بدء المسح بشكل تلقائي بعد إزالة الخطأ
    setTimeout(() => {
      startScan().catch(error => {
        console.error('[useScannerControls] خطأ في محاولة إعادة المسح:', error);
        setHasScannerError(true);
      });
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
    startScan: _startScan,
    stopScan: _stopScan,
    handleManualEntry,
    handleManualCancel,
    requestPermission,
    handleRetry,
    isMockScanActive,
    handleManualInput,
    cameraActive,
    setCameraActive
  };
};
