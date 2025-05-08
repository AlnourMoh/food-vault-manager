
import React, { useEffect, useState, useCallback } from 'react';
import { useZXingBarcodeScanner } from '@/hooks/scanner/useZXingBarcodeScanner';
import { ZXingScannerContent } from './scanner/ZXingScannerContent';
import { Toast } from '@capacitor/toast';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';

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
  const [permissionChecked, setPermissionChecked] = useState(false);
  
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
  
  // التحقق من إذن الكاميرا قبل محاولة تفعيلها
  const checkPermissionAndActivate = useCallback(async () => {
    if (permissionChecked) return;
    
    try {
      console.log('ZXingBarcodeScanner: التحقق من إذن الكاميرا قبل التفعيل...');
      
      // عدم طلب الإذن هنا، فقط التحقق من الحالة الحالية
      const currentPermission = await scannerPermissionService.checkPermission();
      console.log('ZXingBarcodeScanner: نتيجة التحقق من إذن الكاميرا:', currentPermission);
      
      setPermissionChecked(true);
      
      if (!currentPermission) {
        console.log('ZXingBarcodeScanner: لا يوجد إذن للكاميرا، محاولة طلب الإذن...');
        const granted = await requestPermission();
        
        if (!granted) {
          console.log('ZXingBarcodeScanner: تم رفض طلب إذن الكاميرا');
          await Toast.show({
            text: 'تم رفض إذن الكاميرا. لن يعمل الماسح الضوئي بدون هذا الإذن.',
            duration: 'long'
          });
          return;
        }
      }
    } catch (error) {
      console.error('ZXingBarcodeScanner: خطأ في التحقق من إذن الكاميرا:', error);
    }
  }, [requestPermission, permissionChecked]);
  
  // تفعيل الكاميرا تلقائياً عند تحميل المكون إذا كان لديك إذن
  useEffect(() => {
    console.log('ZXingBarcodeScanner: تحميل المكون، حالة الإذن:', hasPermission);
    
    // تأكد من التحقق من الإذن أولاً
    checkPermissionAndActivate();
    
    const initializeCamera = async () => {
      if (hasPermission === true && !cameraActive && !hasScannerError) {
        console.log('ZXingBarcodeScanner: محاولة تفعيل الكاميرا تلقائياً...');
        
        try {
          // إظهار رسالة توضيحية
          await Toast.show({
            text: 'جاري تفعيل الكاميرا...',
            duration: 'short'
          });
          
          // محاولة تفعيل الكاميرا أولاً
          const cameraActivated = await activateCamera();
          console.log('ZXingBarcodeScanner: نتيجة تفعيل الكاميرا:', cameraActivated);
          
          // إذا نجح تفعيل الكاميرا وكان الخيار autoStart مفعلاً، نبدأ المسح
          if (cameraActivated && autoStart) {
            console.log('ZXingBarcodeScanner: الكاميرا نشطة الآن، بدء المسح تلقائياً...');
            await startScan();
            
            await Toast.show({
              text: 'يمكنك الآن مسح الباركود',
              duration: 'short'
            });
          } else if (!cameraActivated) {
            // إذا فشل تفعيل الكاميرا، نقوم بإعادة المحاولة مرة أخرى بعد فترة قصيرة
            if (initAttempts < 3) {
              console.log(`ZXingBarcodeScanner: محاولة تفعيل الكاميرا مرة أخرى... (محاولة ${initAttempts + 1} من 3)`);
              setInitAttempts(prev => prev + 1);
              setTimeout(initializeCamera, 1000);
            } else {
              console.error('ZXingBarcodeScanner: فشلت جميع محاولات تفعيل الكاميرا');
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
        await Toast.show({
          text: 'التطبيق يحتاج إلى إذن الكاميرا للعمل. يرجى منح الإذن عند الطلب',
          duration: 'short'
        });
      }
    };
    
    // إذا تم التحقق من الإذن وهو ممنوح، نحاول تفعيل الكاميرا
    if (permissionChecked && hasPermission === true) {
      initializeCamera();
    }
    
  }, [hasPermission, cameraActive, hasScannerError, activateCamera, autoStart, startScan, initAttempts, permissionChecked, checkPermissionAndActivate]);

  // تنظيف المؤقتات وموارد الكاميرا عند إزالة المكون
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
