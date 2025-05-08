
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
  // استخدام hook للتعامل مع منطق الماسح الضوئي والكاميرا
  const {
    isLoading,
    hasPermission,
    isScanningActive,
    hasScannerError,
    cameraActive,
    startScan,
    stopScan,
    requestPermission,
    handleRetry,
    activateCamera
  } = useZXingBarcodeScanner({
    onScan,
    onClose,
    autoStart
  });
  
  // تفعيل الكاميرا تلقائياً عند تحميل المكون إذا كان لديك إذن
  useEffect(() => {
    console.log('ZXingBarcodeScanner: تحميل المكون، حالة الإذن:', hasPermission);
    
    const initializeCamera = async () => {
      if (hasPermission === true && !cameraActive && !hasScannerError) {
        console.log('ZXingBarcodeScanner: محاولة تفعيل الكاميرا تلقائياً...');
        
        try {
          // محاولة تفعيل الكاميرا أولاً
          const cameraActivated = await activateCamera();
          console.log('ZXingBarcodeScanner: نتيجة تفعيل الكاميرا:', cameraActivated);
          
          // إذا نجح تفعيل الكاميرا وكان الخيار autoStart مفعلاً، نبدأ المسح
          if (cameraActivated && autoStart) {
            console.log('ZXingBarcodeScanner: الكاميرا نشطة الآن، بدء المسح تلقائياً...');
            await startScan();
          }
        } catch (error) {
          console.error('ZXingBarcodeScanner: خطأ في تهيئة الكاميرا:', error);
        }
      } else if (hasPermission === false) {
        console.log('ZXingBarcodeScanner: لا يوجد إذن للكاميرا، سيتم عرض واجهة طلب الإذن');
      }
    };
    
    initializeCamera();
    
  }, [hasPermission, cameraActive, hasScannerError, activateCamera, autoStart, startScan]);

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
