
import React, { useEffect, useState } from 'react';
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
  const [initAttempts, setInitAttempts] = useState(0);
  
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
          } else if (!cameraActivated) {
            // إذا فشل تفعيل الكاميرا، نقوم بإعادة المحاولة مرة أخرى بعد فترة قصيرة
            if (initAttempts < 3) {
              console.log(`محاولة تفعيل الكاميرا مرة أخرى... (محاولة ${initAttempts + 1} من 3)`);
              setInitAttempts(prev => prev + 1);
              setTimeout(initializeCamera, 1000);
            } else {
              console.error('فشلت جميع محاولات تفعيل الكاميرا');
              await Toast.show({
                text: 'تعذر تفعيل الكاميرا بعد عدة محاولات. يرجى التحقق من إذن الكاميرا وإعادة المحاولة',
                duration: 'long'
              });
            }
          }
        } catch (error) {
          console.error('ZXingBarcodeScanner: خطأ في تهيئة الكاميرا:', error);
          await Toast.show({
            text: 'حدث خطأ أثناء تهيئة الكاميرا. يرجى المحاولة مرة أخرى',
            duration: 'short'
          });
        }
      } else if (hasPermission === false) {
        console.log('ZXingBarcodeScanner: لا يوجد إذن للكاميرا، سيتم عرض واجهة طلب الإذن');
        // نعرض للمستخدم إشعاراً توضيحياً
        await Toast.show({
          text: 'التطبيق يحتاج إلى إذن الكاميرا للعمل. يرجى منح الإذن عند الطلب',
          duration: 'short'
        });
      } else if (hasPermission === null) {
        // إذا لم يتم تحديد حالة الإذن بعد، ننتظر قليلاً ثم نحاول طلب الإذن
        console.log('ZXingBarcodeScanner: حالة الإذن غير معروفة، الانتظار قبل طلب الإذن...');
        setTimeout(async () => {
          console.log('طلب إذن الكاميرا تلقائياً...');
          await requestPermission();
        }, 800);
      }
    };
    
    initializeCamera();
    
  }, [hasPermission, cameraActive, hasScannerError, activateCamera, autoStart, startScan, initAttempts, requestPermission]);

  // تنظيف المؤقتات عند إزالة المكون
  useEffect(() => {
    return () => {
      console.log('ZXingBarcodeScanner: تنظيف الموارد...');
      
      // محاولة إيقاف المسح والكاميرا
      if (isScanningActive) {
        stopScan().catch(e => console.error('خطأ في إيقاف المسح عند التنظيف:', e));
      }
    };
  }, [isScanningActive, stopScan]);

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
