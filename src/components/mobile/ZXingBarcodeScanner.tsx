
import React, { useEffect } from 'react';
import { useZXingBarcodeScanner } from '@/hooks/scanner/useZXingBarcodeScanner';
import { ZXingScannerContent } from './scanner/ZXingScannerContent';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ 
  onScan,
  onClose,
  autoStart = true 
}) => {
  const {
    isLoading,
    hasPermission,
    isScanningActive,
    cameraActive,
    hasScannerError,
    startScan,
    stopScan,
    activateCamera,
    requestPermission,
    handleRetry
  } = useZXingBarcodeScanner({
    onScan,
    onClose,
    autoStart
  });
  
  // زيادة كفاءة التطبيق: بدء المسح تلقائياً بمجرد تحميل المكون
  useEffect(() => {
    console.log('ZXingBarcodeScanner: تم تحميل المكون، جاري تفعيل الكاميرا وبدء المسح تلقائياً');
    
    const initializeScanner = async () => {
      try {
        // محاولة طلب الإذن وتفعيل الكاميرا تلقائياً
        if (hasPermission !== false) {
          // محاولة تفعيل الكاميرا
          const activated = await activateCamera();
          if (activated) {
            // بدء المسح تلقائياً
            await startScan();
          }
        }
      } catch (error) {
        console.error('ZXingBarcodeScanner: خطأ في تفعيل الماسح تلقائياً:', error);
      }
    };
    
    // تنفيذ التفعيل التلقائي بعد تأخير قصير
    const timer = setTimeout(() => {
      if (autoStart) {
        console.log('ZXingBarcodeScanner: بدء المسح تلقائياً...');
        initializeScanner();
      }
    }, 300);
    
    // تنظيف مؤقت التأخير عند إلغاء تحميل المكون
    return () => {
      clearTimeout(timer);
      stopScan().catch(e => 
        console.error('ZXingBarcodeScanner: خطأ في إيقاف المسح عند إلغاء التحميل:', e)
      );
    };
  }, [autoStart, hasPermission, startScan, activateCamera, stopScan]);
  
  return (
    <ZXingScannerContent
      isLoading={isLoading}
      hasPermission={hasPermission}
      isScanningActive={isScanningActive}
      hasScannerError={hasScannerError}
      cameraActive={cameraActive}
      onScan={onScan}
      onClose={onClose}
      startScan={startScan}
      stopScan={stopScan}
      requestPermission={requestPermission}
      handleRetry={handleRetry}
    />
  );
};

export default ZXingBarcodeScanner;
