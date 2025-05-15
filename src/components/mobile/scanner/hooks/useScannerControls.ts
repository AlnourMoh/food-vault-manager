
import { useState, useEffect } from 'react';
import { useMockScanner } from '@/hooks/scanner/useMockScanner';
import { useToast } from '@/hooks/use-toast';

// Define a simple interface for scanner state
interface ScannerState {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  hasError: boolean;
  setHasError: (error: boolean) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
  hasPermission: boolean | null;
  lastScannedCode: string | null;
  startScan: () => Promise<boolean>;
  stopScan: () => Promise<boolean>;
  requestPermission: () => Promise<boolean>;
}

interface UseScannerControlsProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useScannerControls = ({ onScan, onClose }: UseScannerControlsProps) => {
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const { toast } = useToast();
  
  // Create a basic scanner state
  const initialScannerState: ScannerState = {
    isLoading: true,
    setIsLoading: () => {},
    hasError: false,
    setHasError: () => {},
    isScanning: false,
    setIsScanning: () => {},
    hasPermission: null,
    lastScannedCode: null,
    startScan: async () => false,
    stopScan: async () => false,
    requestPermission: async () => false
  };
  
  const [scannerState, setScannerState] = useState<ScannerState>(initialScannerState);
  
  // Use mock scanner for fallback
  const {
    startMockScan,
    isMockScanActive,
    handleManualInput,
    cancelMockScan
  } = useMockScanner();

  // Initialize scanner state when component mounts
  useEffect(() => {
    // Import dynamically to avoid build issues
    import('@/hooks/scanner/useScannerState').then(module => {
      const { useScannerState } = module;
      const state = useScannerState({ 
        onScan, 
        onClose,
        autoStart: true 
      });
      
      setScannerState(state);
    }).catch(error => {
      console.error('[useScannerControls] Error importing useScannerState:', error);
      setHasScannerError(true);
    });
    
    return () => {
      console.log('[useScannerControls] تنظيف الموارد عند إلغاء التحميل');
      
      try {
        scannerState.stopScan().catch(e => {
          console.error('[useScannerControls] خطأ في إيقاف المسح عند التنظيف:', e);
        });
        
        if (isManualEntry) {
          cancelMockScan();
        }
      } catch (error) {
        console.error('[useScannerControls] خطأ غير متوقع أثناء التنظيف:', error);
      }
    };
  }, []);

  // تفعيل الكاميرا تلقائيًا عند التحميل
  useEffect(() => {
    if (!cameraActive && !scannerState.isLoading) {
      console.log('[useScannerControls] تفعيل الكاميرا تلقائيًا عند التحميل');
      setCameraActive(true);
    }
  }, [cameraActive, scannerState.isLoading]);

  // تحديث حالة الكاميرا عند تغير حالة المسح
  useEffect(() => {
    if (scannerState.isScanning && !cameraActive) {
      setCameraActive(true);
    }
  }, [scannerState.isScanning, cameraActive]);

  // تبسيط بدء المسح بأقل فرص للأخطاء
  const startScan = async () => {
    try {
      console.log('[useScannerControls] بدء المسح بالطريقة المبسطة...');
      setCameraActive(true);
      
      // كان هناك مشكلة سابقة في تسلسل التنفيذ، الآن نضمن التسلسل الصحيح
      const success = await scannerState.startScan();
      
      if (!success) {
        console.log('[useScannerControls] فشل بدء المسح، محاولة مرة أخرى بتأخير قصير');
        // محاولة ثانية بعد فترة قصيرة
        setTimeout(async () => {
          await scannerState.startScan().catch(error => {
            console.error('[useScannerControls] فشل في المحاولة الثانية:', error);
          });
        }, 500);
      }
      
      return success;
    } catch (error) {
      console.error('[useScannerControls] خطأ غير متوقع عند بدء المسح:', error);
      setHasScannerError(true);
      return false;
    }
  };

  // وظيفة إيقاف المسح بشكل آمن
  const stopScan = async () => {
    try {
      console.log('[useScannerControls] إيقاف المسح');
      // إضافة تأخير قصير قبل إيقاف الكاميرا لتفادي التحولات المرئية المفاجئة
      setTimeout(() => setCameraActive(false), 100);
      return await scannerState.stopScan();
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
      if (scannerState.isScanning) {
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
    isLoading: scannerState.isLoading,
    hasPermission: scannerState.hasPermission,
    isScanningActive: scannerState.isScanning,
    lastScannedCode: scannerState.lastScannedCode,
    startScan: scannerState.startScan,
    stopScan: scannerState.stopScan,
    handleManualEntry,
    handleManualCancel,
    requestPermission: scannerState.requestPermission,
    handleRetry,
    isMockScanActive,
    handleManualInput,
    cameraActive,
    setCameraActive
  };
};
