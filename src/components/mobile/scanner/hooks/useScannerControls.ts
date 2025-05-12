
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

  // تنظيف أي حالة نشطة عند إلغاء تحميل المكون - تحسين معالجة الأخطاء
  useEffect(() => {
    return () => {
      console.log('[useScannerControls] تنظيف الموارد عند إلغاء التحميل');
      
      try {
        if (isActive) {
          // استخدام أسلوب أكثر أمانًا لإيقاف المسح باستخدام Promise
          stopScan().catch(e => {
            console.error('[useScannerControls] خطأ في إيقاف المسح عند التنظيف:', e);
            // لا نرمي الخطأ هنا لتجنب انهيار التطبيق أثناء التنظيف
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

  // وظيفة بدء المسح مع تعزيز معالجة الأخطاء ومحاولات إعادة المحاولة
  const startScan = async () => {
    try {
      console.log('[useScannerControls] محاولة بدء المسح...');
      setIsActive(true);
      
      // محاولة أولى
      try {
        return await _startScan();
      } catch (error) {
        console.error('[useScannerControls] خطأ في المحاولة الأولى:', error);
        
        // يونس صغير للسماح بتهدئة الموارد
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // محاولة ثانية بعد تأخير قصير
        try {
          console.log('[useScannerControls] محاولة ثانية للمسح بعد تأخير قصير');
          return await _startScan();
        } catch (secondError) {
          console.error('[useScannerControls] فشل المحاولة الثانية:', secondError);
          
          // في حالة فشل كل المحاولات، نتحول إلى الإدخال اليدوي
          setHasScannerError(true);
          setIsActive(false);
          handleManualEntry();
          return false;
        }
      }
    } catch (unexpectedError) {
      console.error('[useScannerControls] خطأ غير متوقع عند بدء المسح:', unexpectedError);
      setHasScannerError(true);
      setIsActive(false);
      handleManualEntry();
      return false;
    }
  };

  // وظيفة إيقاف المسح مع معالجة أخطاء محسنة
  const stopScan = async () => {
    try {
      console.log('[useScannerControls] إيقاف المسح');
      setIsActive(false);
      return await _stopScan();
    } catch (error) {
      console.error('[useScannerControls] خطأ عند إيقاف المسح:', error);
      // نعيد false في حالة حدوث خطأ، لكننا لا نسمح للخطأ بالتسبب في انهيار التطبيق
      return false;
    }
  };

  // تحسين التحويل إلى الإدخال اليدوي مع معالجة أخطاء أفضل
  const handleManualEntry = () => {
    console.log('[Scanner] التحويل إلى إدخال الكود يدويًا');
    try {
      // إيقاف المسح الحالي أولاً إذا كان نشطًا
      if (isActive) {
        stopScan().catch(error => {
          console.error('[Scanner] خطأ عند إيقاف المسح قبل الإدخال اليدوي:', error);
          // نستمر بالرغم من الخطأ
        });
      }
      
      setIsManualEntry(true);
      startMockScan(onScan);
    } catch (error) {
      console.error('[Scanner] خطأ غير متوقع عند التحويل للإدخال اليدوي:', error);
      // محاولة إعادة تعيين الحالة في حالة الخطأ
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
    
    // محاولة إعادة المسح مع معالجة الأخطاء
    startScan().catch(error => {
      console.error('[useScannerControls] خطأ في محاولة إعادة المسح:', error);
      setHasScannerError(true);
      // في حالة فشل المحاولة مجددًا، انتقل إلى الإدخال اليدوي مباشرة
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
    requestPermission // Ensure we export this function with the correct name
  };
};
