
import { useState, useEffect, useCallback } from 'react';
import { Toast } from '@capacitor/toast';

interface UseZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

export const useZXingBarcodeScanner = ({ 
  onScan, 
  onClose, 
  autoStart = true 
}: UseZXingBarcodeScannerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  const [cameraInitializing, setCameraInitializing] = useState(false);

  // طلب الإذن
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useZXingBarcodeScanner] طلب إذن الكاميرا...');
      
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
      console.error('[useZXingBarcodeScanner] خطأ في طلب الإذن:', error);
      setHasPermission(false);
      setIsLoading(false);
      
      await Toast.show({
        text: 'تعذر الحصول على إذن الكاميرا',
        duration: 'short',
        position: 'center'
      });
      
      return false;
    }
  }, []);

  // بدء المسح مع التأكد من تفعيل الكاميرا أولاً
  const startScan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useZXingBarcodeScanner] بدء عملية المسح...');
      
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
      console.error('[useZXingBarcodeScanner] خطأ في بدء المسح:', error);
      setIsScanningActive(false);
      setHasScannerError(true);
      
      await Toast.show({
        text: 'تعذر تفعيل الكاميرا، يرجى المحاولة مرة أخرى',
        duration: 'short'
      });
      
      return false;
    }
  }, [cameraInitializing]);

  // إيقاف المسح
  const stopScan = useCallback(async (): Promise<boolean> => {
    setIsScanningActive(false);
    await Toast.show({
      text: 'تم إيقاف الماسح',
      duration: 'short'
    });
    return true;
  }, []);

  // إعادة المحاولة
  const handleRetry = useCallback((): void => {
    setHasScannerError(false);
    startScan();
  }, [startScan]);
  
  // تهيئة المسح الضوئي تلقائيًا عند تحميل المكون
  useEffect(() => {
    const initializeScanner = async () => {
      setIsLoading(true);
      console.log('[useZXingBarcodeScanner] تهيئة الماسح وفحص الأذونات...');

      try {
        // محاكاة التحقق من الأذونات وتفعيل الكاميرا
        await Toast.show({
          text: 'جاري التحقق من أذونات الكاميرا...',
          duration: 'short'
        });
        
        // طلب الأذونات فوراً
        const permissionGranted = await requestPermission();
        
        if (permissionGranted && autoStart) {
          // بدء المسح مباشرة إذا تم منح الإذن
          console.log('[useZXingBarcodeScanner] بدء المسح تلقائياً...');
          await startScan();
        }
      } catch (error) {
        console.error('[useZXingBarcodeScanner] خطأ في تهيئة الماسح:', error);
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
  }, [autoStart, requestPermission, startScan, stopScan]);

  // إجراء عند اكتشاف باركود
  const handleBarcodeDetected = useCallback((code: string) => {
    try {
      console.log('[useZXingBarcodeScanner] تم اكتشاف باركود:', code);
      
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
      console.error('[useZXingBarcodeScanner] خطأ في معالجة الباركود:', error);
      return false;
    }
  }, [onScan, stopScan]);
  
  // وظيفة محاكية للكشف عن باركود - تسرع المسح للتجربة
  useEffect(() => {
    if (isScanningActive && !hasScannerError) {
      console.log('[useZXingBarcodeScanner] الماسح نشط، بدء محاكاة الكشف عن باركود...');
      
      // محاكاة وقت المسح - تم تقليله من 3 إلى 2 ثانية
      const timer = setTimeout(() => {
        const simulatedBarcode = `DEMO-${Math.floor(Math.random() * 9000) + 1000}`;
        handleBarcodeDetected(simulatedBarcode);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isScanningActive, hasScannerError, handleBarcodeDetected]);
  
  return {
    isLoading,
    hasPermission,
    isScanningActive,
    hasScannerError,
    startScan,
    stopScan,
    requestPermission,
    handleRetry
  };
};
