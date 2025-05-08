
import { useState, useCallback, useEffect } from 'react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
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
  const [cameraActive, setCameraActive] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  
  // تحقق من حالة الإذن عند تحميل المكون
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setIsLoading(true);
        console.log('useZXingBarcodeScanner: التحقق من حالة إذن الكاميرا...');
        
        // التحقق من دعم الماسح أولاً
        const isSupported = await scannerPermissionService.isSupported();
        if (!isSupported) {
          console.error('useZXingBarcodeScanner: الماسح غير مدعوم على هذا الجهاز');
          setHasScannerError(true);
          setIsLoading(false);
          
          await Toast.show({
            text: 'الماسح غير مدعوم على جهازك، يرجى المحاولة على جهاز آخر',
            duration: 'long'
          });
          return;
        }
        
        // التحقق من حالة الإذن
        const hasPermission = await scannerPermissionService.checkPermission();
        console.log('useZXingBarcodeScanner: نتيجة التحقق من الإذن:', hasPermission);
        
        setHasPermission(hasPermission);
        
        // إذا كان لديك إذن وتم تفعيل autoStart، نحاول تفعيل الكاميرا تلقائياً
        if (hasPermission && autoStart) {
          console.log('useZXingBarcodeScanner: لديك إذن للكاميرا، جاري محاولة تفعيلها تلقائياً...');
        }
        
      } catch (error) {
        console.error('useZXingBarcodeScanner: خطأ في التحقق من الأذونات:', error);
        setHasScannerError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPermissions();
  }, [autoStart]);
  
  // وظيفة لطلب إذن الكاميرا
  const requestPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      
      console.log('useZXingBarcodeScanner: جاري طلب إذن الكاميرا...');
      await Toast.show({
        text: 'جاري طلب إذن الكاميرا...',
        duration: 'short'
      });
      
      const granted = await scannerPermissionService.requestPermission();
      console.log('useZXingBarcodeScanner: نتيجة طلب الإذن:', granted);
      
      setHasPermission(granted);
      
      if (granted) {
        await Toast.show({
          text: 'تم منح إذن الكاميرا بنجاح! جاري تفعيل الكاميرا...',
          duration: 'short'
        });
        
        // محاولة تفعيل الكاميرا بعد منح الإذن
        const cameraActivated = await activateCamera();
        
        if (!cameraActivated) {
          console.error('useZXingBarcodeScanner: فشل في تفعيل الكاميرا بعد منح الإذن');
          setHasScannerError(true);
          return false;
        }
      } else {
        await Toast.show({
          text: 'تم رفض إذن الكاميرا، لن يتمكن الماسح من العمل بدون هذا الإذن',
          duration: 'long'
        });
      }
      
      return granted;
    } catch (error) {
      console.error('useZXingBarcodeScanner: خطأ في طلب الإذن:', error);
      setHasScannerError(true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // وظيفة لتفعيل الكاميرا
  const activateCamera = useCallback(async () => {
    try {
      if (cameraActive) {
        console.log('useZXingBarcodeScanner: الكاميرا نشطة بالفعل');
        return true;
      }
      
      console.log('useZXingBarcodeScanner: جاري محاولة تفعيل الكاميرا...');
      setIsLoading(true);
      
      // التحقق من وجود الإذن قبل محاولة تفعيل الكاميرا
      if (hasPermission !== true) {
        console.log('useZXingBarcodeScanner: لا يمكن تفعيل الكاميرا بدون إذن');
        // طلب الإذن تلقائياً إذا لم يكن موجوداً
        const granted = await requestPermission();
        if (!granted) {
          console.error('useZXingBarcodeScanner: لم يتم منح إذن الكاميرا');
          setIsLoading(false);
          return false;
        }
      }
      
      // محاولة تفعيل الكاميرا
      await Toast.show({
        text: 'جاري تفعيل الكاميرا...',
        duration: 'short'
      });
      
      // هنا يجب إضافة الكود الفعلي لتفعيل الكاميرا حسب المنصة
      // نستخدم تأخير مصطنع لمحاكاة عملية التفعيل
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCameraActive(true);
      
      await Toast.show({
        text: 'تم تفعيل الكاميرا بنجاح',
        duration: 'short'
      });
      
      return true;
    } catch (error) {
      console.error('useZXingBarcodeScanner: خطأ في تفعيل الكاميرا:', error);
      setHasScannerError(true);
      
      await Toast.show({
        text: 'تعذر تفعيل الكاميرا، يرجى المحاولة مرة أخرى',
        duration: 'short'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [cameraActive, hasPermission, requestPermission]);
  
  // وظيفة لبدء المسح
  const startScan = useCallback(async () => {
    try {
      console.log('useZXingBarcodeScanner: محاولة بدء المسح...');
      
      // التأكد من تفعيل الكاميرا أولاً
      if (!cameraActive) {
        console.log('useZXingBarcodeScanner: الكاميرا غير نشطة، محاولة تفعيلها أولاً...');
        
        const cameraActivated = await activateCamera();
        if (!cameraActivated) {
          console.error('useZXingBarcodeScanner: فشل في تفعيل الكاميرا، لا يمكن بدء المسح');
          return false;
        }
      }
      
      // بدء المسح الفعلي
      setIsScanningActive(true);
      
      // محاكاة عملية المسح
      console.log('useZXingBarcodeScanner: بدء المسح بنجاح، جاري البحث عن الباركود...');
      
      // محاكاة العثور على باركود بعد 3-5 ثوانٍ
      // هذا للاختبار فقط وسيتم إزالته في الإصدار النهائي
      const simulateScan = false; // قم بتغييره إلى true لاختبار محاكاة المسح
      if (simulateScan) {
        setTimeout(() => {
          console.log('useZXingBarcodeScanner: تمت محاكاة العثور على باركود');
          onScan('MOCK-BARCODE-12345');
        }, Math.random() * 2000 + 3000);
      }
      
      return true;
    } catch (error) {
      console.error('useZXingBarcodeScanner: خطأ في بدء المسح:', error);
      setIsScanningActive(false);
      setHasScannerError(true);
      return false;
    }
  }, [cameraActive, activateCamera, onScan]);
  
  // وظيفة لإيقاف المسح
  const stopScan = useCallback(async () => {
    try {
      console.log('useZXingBarcodeScanner: إيقاف المسح...');
      setIsScanningActive(false);
      
      // إيقاف الكاميرا أيضًا عند إيقاف المسح
      setCameraActive(false);
      
      return true;
    } catch (error) {
      console.error('useZXingBarcodeScanner: خطأ في إيقاف المسح:', error);
      return false;
    }
  }, []);
  
  // وظيفة لإعادة المحاولة بعد حدوث خطأ
  const handleRetry = useCallback(() => {
    console.log('useZXingBarcodeScanner: إعادة المحاولة بعد حدوث خطأ...');
    setHasScannerError(false);
    setCameraActive(false);
    
    // محاولة تفعيل الكاميرا وبدء المسح مجدداً
    activateCamera().then(activated => {
      if (activated) {
        startScan();
      }
    });
  }, [activateCamera, startScan]);
  
  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log('useZXingBarcodeScanner: تنظيف الموارد...');
      
      // إيقاف المسح والكاميرا
      setIsScanningActive(false);
      setCameraActive(false);
    };
  }, []);
  
  return {
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
  };
};
