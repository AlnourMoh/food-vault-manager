
import { useState, useCallback, useEffect } from 'react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';

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
        const permissionResult = await scannerPermissionService.checkPermission();
        console.log('useZXingBarcodeScanner: نتيجة التحقق من الإذن:', permissionResult);
        
        setHasPermission(permissionResult);
        
        // إذا كان لديك إذن وتم تفعيل autoStart، نحاول تفعيل الكاميرا تلقائياً
        if (permissionResult && autoStart) {
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
      
      // محاولة طلب الإذن باستخدام MLKitBarcodeScanner أولاً
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const status = await BarcodeScanner.checkPermissions();
          
          if (status.camera === 'granted') {
            console.log('useZXingBarcodeScanner: إذن BarcodeScanner ممنوح بالفعل');
            setHasPermission(true);
            setIsLoading(false);
            return true;
          }
          
          const requestResult = await BarcodeScanner.requestPermissions();
          if (requestResult.camera === 'granted') {
            console.log('useZXingBarcodeScanner: تم منح إذن BarcodeScanner');
            setHasPermission(true);
            setIsLoading(false);
            return true;
          } else {
            console.log('useZXingBarcodeScanner: تم رفض إذن BarcodeScanner');
            setHasPermission(false);
            setIsLoading(false);
            return false;
          }
        } catch (e) {
          console.error('useZXingBarcodeScanner: خطأ في طلب إذن BarcodeScanner:', e);
        }
      }
      
      // استخدام خدمة أذونات الماسح الضوئي العامة كاحتياطي
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
        console.log('useZXingBarcodeScanner: لا يمكن تفعيل الكاميرا بدون إذن، جاري طلب الإذن...');
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
      
      // هنا يتم التفعيل الفعلي للكاميرا حسب المنصة
      let activated = false;
      
      if (Capacitor.isNativePlatform()) {
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          try {
            // تحقق من دعم الماسح أولاً
            const supported = await BarcodeScanner.isSupported();
            if (supported.supported) {
              console.log('MLKitBarcodeScanner مدعوم، جاري بدء التهيئة...');
              // هنا يمكن عمل أي تهيئة مطلوبة للماسح
              activated = true;
            } else {
              console.error('MLKitBarcodeScanner غير مدعوم على هذا الجهاز');
            }
          } catch (e) {
            console.error('خطأ في تهيئة MLKitBarcodeScanner:', e);
          }
        } else {
          console.log('MLKitBarcodeScanner غير متاح، جاري استخدام محاكاة الكاميرا للاختبار');
          // محاكاة نجاح تفعيل الكاميرا للتجربة
          activated = true;
        }
      } else {
        console.log('نحن في بيئة الويب، استخدام محاكاة الكاميرا للاختبار');
        // محاكاة نجاح تفعيل الكاميرا في بيئة الويب
        activated = true;
      }
      
      setCameraActive(activated);
      
      if (activated) {
        await Toast.show({
          text: 'تم تفعيل الكاميرا بنجاح',
          duration: 'short'
        });
      } else {
        await Toast.show({
          text: 'تعذر تفعيل الكاميرا، يرجى المحاولة مرة أخرى',
          duration: 'short'
        });
      }
      
      return activated;
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
      
      // تهيئة وبدء المسح حسب المنصة
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          console.log('بدء استخدام MLKitBarcodeScanner للمسح...');
          
          // تهيئة حدث المسح - تغيير من "barcodeScanned" إلى "barcodesScanned" (الصيغة الجمع)
          const listener = await BarcodeScanner.addListener(
            'barcodesScanned',
            async result => {
              try {
                console.log('تم اكتشاف باركود:', result.barcodes);
                // إيقاف المسح وإرسال النتيجة
                await stopScan();
                if (result.barcodes && result.barcodes.length > 0) {
                  onScan(result.barcodes[0].rawValue || '');
                }
              } catch (e) {
                console.error('خطأ في معالجة نتيجة المسح:', e);
              }
            }
          );
          
          // بدء المسح باستخدام واجهة MLKit
          await BarcodeScanner.startScan();
          
          console.log('تم بدء مسح الباركود بنجاح');
          return true;
        } catch (e) {
          console.error('خطأ في بدء مسح MLKitBarcodeScanner:', e);
          setIsScanningActive(false);
          setHasScannerError(true);
          return false;
        }
      } else {
        // في بيئة المحاكاة أو الويب، نقوم بمحاكاة نجاح بدء المسح
        console.log('المسح جاهز، انتظار تحديد الباركود');
        return true;
      }
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
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          await BarcodeScanner.stopScan();
          console.log('تم إيقاف مسح الباركود');
        } catch (e) {
          console.error('خطأ في إيقاف مسح MLKitBarcodeScanner:', e);
        }
      }
      
      setIsScanningActive(false);
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
    setTimeout(() => {
      activateCamera().then(activated => {
        if (activated) {
          startScan();
        }
      });
    }, 500);
  }, [activateCamera, startScan]);
  
  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log('useZXingBarcodeScanner: تنظيف الموارد...');
      
      // إيقاف المسح والكاميرا
      if (isScanningActive) {
        stopScan().catch(e => console.error('خطأ في إيقاف المسح عند التنظيف:', e));
      }
      
      // إزالة أي مستمعين للأحداث
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        BarcodeScanner.removeAllListeners();
      }
    };
  }, [isScanningActive, stopScan]);
  
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
