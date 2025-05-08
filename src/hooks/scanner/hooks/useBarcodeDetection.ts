
import { useCallback, useEffect } from 'react';
import { Toast } from '@capacitor/toast';

export const useBarcodeDetection = (
  onScan: (code: string) => void,
  stopScan: () => Promise<boolean>,
  isScanningActive: boolean,
  hasScannerError: boolean,
  cameraActive: boolean
) => {
  // إجراء عند اكتشاف باركود
  const handleBarcodeDetected = useCallback((code: string) => {
    try {
      console.log('[useBarcodeDetection] تم اكتشاف باركود:', code);
      
      // إظهار إشعار بنجاح المسح
      Toast.show({
        text: 'تم مسح الباركود بنجاح',
        duration: 'short'
      });
      
      // إيقاف المسح
      stopScan();
      
      // استدعاء وظيفة المسح
      onScan(code);
      
      return true;
    } catch (error) {
      console.error('[useBarcodeDetection] خطأ في معالجة الباركود:', error);
      return false;
    }
  }, [onScan, stopScan]);
  
  // وظيفة محاكية للكشف عن باركود - تسرع المسح للتجربة
  useEffect(() => {
    if (isScanningActive && !hasScannerError && cameraActive) {
      console.log('[useBarcodeDetection] الماسح والكاميرا نشطان، بدء محاكاة الكشف عن باركود...');
      
      // محاكاة وقت المسح - تم تقليله إلى 2 ثانية
      const timer = setTimeout(() => {
        const simulatedBarcode = `DEMO-${Math.floor(Math.random() * 9000) + 1000}`;
        handleBarcodeDetected(simulatedBarcode);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isScanningActive, hasScannerError, cameraActive, handleBarcodeDetected]);

  return {
    handleBarcodeDetected
  };
};
