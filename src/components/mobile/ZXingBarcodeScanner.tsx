
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
    console.log('ZXingBarcodeScanner: تم تحميل المكون، جاري تفعيل الكاميرا وبدء المسح تلقائياً');
    
    const initializeScanner = async () => {
      try {
        // طلب الإذن أولاً إذا لم يكن موجوداً
        if (hasPermission === false) {
          console.log('ZXingBarcodeScanner: لا يوجد إذن، جاري طلبه...');
          const granted = await requestPermission();
          if (!granted) {
            console.log('ZXingBarcodeScanner: تم رفض طلب الإذن');
            return;
          }
        }
        
        // محاولة تفعيل الكاميرا بشكل مباشر
        console.log('ZXingBarcodeScanner: جاري تفعيل الكاميرا...');
        const activated = await activateCamera();
        
        if (activated) {
          console.log('ZXingBarcodeScanner: تم تفعيل الكاميرا، جاري بدء المسح...');
          // تأخير قصير قبل بدء المسح لضمان تهيئة الكاميرا بشكل كامل
          setTimeout(async () => {
            await startScan();
          }, 500);
        } else {
          console.error('ZXingBarcodeScanner: فشل في تفعيل الكاميرا');
          Toast.show({
            text: 'تعذر تفعيل الكاميرا، حاول مرة أخرى',
            duration: 'short'
          });
        }
      } catch (error) {
        console.error('ZXingBarcodeScanner: خطأ في تفعيل الماسح تلقائياً:', error);
      }
    };
    
    // بدء التفعيل مباشرة إذا كان autoStart مفعلاً
    if (autoStart) {
      initializeScanner();
    }
    
    // تنظيف مؤقت التأخير عند إلغاء تحميل المكون
    return () => {
      stopScan().catch(e => 
        console.error('ZXingBarcodeScanner: خطأ في إيقاف المسح عند إلغاء التحميل:', e)
      );
    };
  }, [autoStart, hasPermission, requestPermission, activateCamera, startScan, stopScan]);
  
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
