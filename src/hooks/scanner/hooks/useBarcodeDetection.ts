
import { useCallback, useEffect, useRef } from 'react';
import { Toast } from '@capacitor/toast';

export const useBarcodeDetection = (
  onScan: (code: string) => void,
  stopScan: () => Promise<boolean>,
  isScanningActive: boolean,
  hasScannerError: boolean,
  cameraActive: boolean
) => {
  // استخدام مرجع للتحكم في توقيت المحاكاة
  const simulationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
      }
    };
  }, []);

  // إجراء عند اكتشاف باركود
  const handleBarcodeDetected = useCallback((code: string) => {
    try {
      console.log('[useBarcodeDetection] تم اكتشاف باركود:', code);
      
      // إظهار إشعار بنجاح المسح
      Toast.show({
        text: 'تم مسح الباركود بنجاح',
        duration: 'short'
      });
      
      // استدعاء وظيفة المسح
      onScan(code);
      
      // نؤخر إيقاف المسح قليلاً للتأكد من معالجة النتيجة
      setTimeout(() => {
        stopScan();
      }, 500);
      
      return true;
    } catch (error) {
      console.error('[useBarcodeDetection] خطأ في معالجة الباركود:', error);
      return false;
    }
  }, [onScan, stopScan]);
  
  // وظيفة محاكية للكشف عن باركود مع تأخير أطول
  useEffect(() => {
    if (isScanningActive && !hasScannerError && cameraActive) {
      console.log('[useBarcodeDetection] الماسح والكاميرا نشطان، بدء محاكاة الكشف عن باركود...');
      
      // إلغاء أي محاكاة سابقة
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
      }
      
      // محاكاة وقت المسح - تم زيادته إلى 30 ثانية للاختبار الأطول
      simulationTimeoutRef.current = setTimeout(() => {
        // التحقق مرة أخرى أن المسح لا يزال نشطًا
        if (isScanningActive && cameraActive) {
          const simulatedBarcode = `DEMO-${Math.floor(Math.random() * 9000) + 1000}`;
          handleBarcodeDetected(simulatedBarcode);
        }
      }, 30000);  // 30 ثانية بدلاً من 2 ثوانٍ

      return () => {
        if (simulationTimeoutRef.current) {
          clearTimeout(simulationTimeoutRef.current);
        }
      };
    }
  }, [isScanningActive, hasScannerError, cameraActive, handleBarcodeDetected]);

  return {
    handleBarcodeDetected
  };
};
