
import React, { useEffect } from 'react';
import { useZXingBarcodeScanner } from '@/hooks/scanner/useZXingBarcodeScanner';
import { ZXingScannerContent } from './scanner/ZXingScannerContent';
import { Toast } from '@capacitor/toast';

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
  
  // تفعيل الكاميرا وبدء المسح فوراً عند تحميل المكون
  useEffect(() => {
    const initScanner = async () => {
      console.log('ZXingBarcodeScanner: تم تحميل المكون، جاري تفعيل الكاميرا...');
      
      try {
        if (hasPermission === null) {
          console.log('ZXingBarcodeScanner: انتظار التحقق من الإذن...');
          return; // ننتظر حتى يكتمل فحص الإذن
        }
        
        if (hasPermission === false) {
          console.log('ZXingBarcodeScanner: لا يوجد إذن، جاري طلبه...');
          const granted = await requestPermission();
          if (!granted) {
            console.log('ZXingBarcodeScanner: تم رفض طلب الإذن');
            return;
          }
        }
        
        console.log('ZXingBarcodeScanner: لدينا إذن، جاري تفعيل الكاميرا...');
        const activated = await activateCamera();
        
        if (activated) {
          console.log('ZXingBarcodeScanner: تم تفعيل الكاميرا بنجاح');
        } else {
          console.error('ZXingBarcodeScanner: فشل في تفعيل الكاميرا');
          Toast.show({
            text: 'تعذر تفعيل الكاميرا، يرجى المحاولة مرة أخرى',
            duration: 'short'
          });
        }
      } catch (error) {
        console.error('ZXingBarcodeScanner: خطأ في تهيئة الماسح:', error);
      }
    };
    
    if (autoStart) {
      initScanner();
    }
    
    // تنظيف عند إزالة المكون
    return () => {
      console.log('ZXingBarcodeScanner: تنظيف الموارد...');
      stopScan().catch(e => {
        console.error('ZXingBarcodeScanner: خطأ في إيقاف المسح عند التنظيف:', e);
      });
    };
  }, [hasPermission, autoStart, requestPermission, activateCamera, stopScan]);
  
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
