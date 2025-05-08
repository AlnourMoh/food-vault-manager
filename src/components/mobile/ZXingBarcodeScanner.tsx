
import React, { useEffect, useState } from 'react';
import { ScannerView } from '@/components/mobile/scanner/ScannerView';
import { NoPermissionView } from '@/components/mobile/scanner/NoPermissionView';
import { ScannerLoading } from '@/components/mobile/scanner/ScannerLoading';
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  const [cameraInitializing, setCameraInitializing] = useState(false);

  // طلب الإذن
  const requestPermission = async (): Promise<boolean> => {
    try {
      console.log('[ZXingBarcodeScanner] طلب إذن الكاميرا...');
      
      // توقيت محاكاة طلب الإذن
      setIsLoading(true);
      
      // إظهار إشعار للمستخدم
      await Toast.show({
        text: 'جاري طلب إذن الكاميرا...',
        duration: 'short'
      });
      
      // محاكاة طلب الإذن
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasPermission(true);
      setIsLoading(false);
      
      await Toast.show({
        text: 'تم منح إذن الكاميرا بنجاح',
        duration: 'short'
      });
      
      return true;
    } catch (error) {
      console.error('[ZXingBarcodeScanner] خطأ في طلب الإذن:', error);
      setHasPermission(false);
      setIsLoading(false);
      
      await Toast.show({
        text: 'تعذر الحصول على إذن الكاميرا',
        duration: 'short',
        position: 'center'
      });
      
      return false;
    }
  };

  // بدء المسح مع التأكد من تفعيل الكاميرا أولاً
  const startScan = async (): Promise<boolean> => {
    try {
      console.log('[ZXingBarcodeScanner] بدء عملية المسح...');
      
      // إذا لم تكن الكاميرا قيد التهيئة بالفعل
      if (!cameraInitializing) {
        setCameraInitializing(true);
        
        // إظهار إشعار لتفعيل الكاميرا
        await Toast.show({
          text: 'جاري تفعيل الكاميرا...',
          duration: 'short'
        });
        
        // محاكاة وقت تفعيل الكاميرا
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setCameraInitializing(false);
      }
      
      // تفعيل حالة المسح النشط
      setIsScanningActive(true);
      
      // إظهار إشعار لنجاح تفعيل الكاميرا
      await Toast.show({
        text: 'تم تفعيل الكاميرا بنجاح',
        duration: 'short'
      });
      
      return true;
    } catch (error) {
      console.error('[ZXingBarcodeScanner] خطأ في بدء المسح:', error);
      setIsScanningActive(false);
      setHasScannerError(true);
      
      await Toast.show({
        text: 'تعذر تفعيل الكاميرا، يرجى المحاولة مرة أخرى',
        duration: 'short'
      });
      
      return false;
    }
  };

  // إيقاف المسح
  const stopScan = async (): Promise<void> => {
    setIsScanningActive(false);
    await Toast.show({
      text: 'تم إيقاف الماسح',
      duration: 'short'
    });
  };

  // إعادة المحاولة
  const handleRetry = (): void => {
    setHasScannerError(false);
    startScan();
  };

  // تهيئة المسح الضوئي تلقائيًا عند تحميل المكون
  useEffect(() => {
    const initializeScanner = async () => {
      setIsLoading(true);
      console.log('[ZXingBarcodeScanner] تهيئة الماسح وفحص الأذونات...');

      try {
        // محاكاة التحقق من الأذونات وتفعيل الكاميرا
        await Toast.show({
          text: 'جاري التحقق من أذونات الكاميرا...',
          duration: 'short'
        });
        
        // طلب الأذونات فوراً
        const permissionGranted = await requestPermission();
        
        if (permissionGranted) {
          // بدء المسح مباشرة إذا تم منح الإذن
          if (autoStart) {
            console.log('[ZXingBarcodeScanner] بدء المسح تلقائياً...');
            await startScan();
          }
        }
      } catch (error) {
        console.error('[ZXingBarcodeScanner] خطأ في تهيئة الماسح:', error);
        setHasPermission(false);
        setIsLoading(false);
        
        await Toast.show({
          text: 'فشل في تهيئة الماسح الضوئي',
          duration: 'short'
        });
      }
    };

    // تشغيل الماسح مباشرة عند التحميل
    initializeScanner();

    // عند إلغاء تحميل المكون، نتأكد من إيقاف المسح
    return () => {
      stopScan();
    };
  }, [autoStart]);

  // إجراء عند اكتشاف باركود
  const handleBarcodeDetected = async (code: string) => {
    try {
      console.log('[ZXingBarcodeScanner] تم اكتشاف باركود:', code);
      
      // إظهار إشعار بنجاح المسح
      await Toast.show({
        text: 'تم مسح الباركود بنجاح',
        duration: 'short'
      });
      
      // إيقاف المسح
      await stopScan();
      
      // استدعاء وظيفة المسح
      onScan(code);
    } catch (error) {
      console.error('[ZXingBarcodeScanner] خطأ في معالجة الباركود:', error);
    }
  };

  // وظيفة محاكية للكشف عن باركود - تسرع المسح للتجربة
  useEffect(() => {
    if (isScanningActive && !hasScannerError) {
      console.log('[ZXingBarcodeScanner] الماسح نشط، بدء محاكاة الكشف عن باركود...');
      
      // محاكاة وقت المسح - تم تقليله من 3 إلى 2 ثانية
      const timer = setTimeout(() => {
        const simulatedBarcode = `DEMO-${Math.floor(Math.random() * 9000) + 1000}`;
        handleBarcodeDetected(simulatedBarcode);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isScanningActive, hasScannerError]);

  if (isLoading) {
    return <ScannerLoading onClose={onClose} />;
  }

  if (hasPermission === false) {
    return (
      <NoPermissionView
        onRequestPermission={requestPermission}
        onClose={onClose}
      />
    );
  }

  return (
    <ScannerView
      isActive={isScanningActive}
      hasError={hasScannerError}
      onStartScan={startScan}
      onStopScan={stopScan}
      onRetry={handleRetry}
      onClose={onClose}
    />
  );
};

export default ZXingBarcodeScanner;
