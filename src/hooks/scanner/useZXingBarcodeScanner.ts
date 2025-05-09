
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
  
  // Declare stopScan early as a function reference that will be defined later
  // This resolves the "used before declaration" error
  const stopScanRef = useCallback(async (): Promise<boolean> => {
    try {
      console.log('useZXingBarcodeScanner: إيقاف المسح...');
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          // إيقاف المسح وإزالة المستمعين
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
  
  // تحقق من حالة الإذن عند تحميل المكون
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setIsLoading(true);
        console.log('useZXingBarcodeScanner: التحقق من حالة إذن الكاميرا...');
        
        // تسجيل للتشخيص
        console.log('useZXingBarcodeScanner: جاري تحقق حالة إذن الكاميرا');
        
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
        setIsLoading(false);
        
        // إذا كان الإذن ممنوحاً وتفعيل تلقائي مطلوب، نبدأ بتفعيل الكاميرا
        if (permissionResult === true && autoStart) {
          console.log('useZXingBarcodeScanner: الإذن ممنوح، بدء تفعيل الكاميرا تلقائياً...');
          setTimeout(() => {
            activateCamera();
          }, 500);
        }
      } catch (error) {
        console.error('useZXingBarcodeScanner: خطأ في التحقق من الأذونات:', error);
        setHasScannerError(true);
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
      
      // استخدام خدمة أذونات الماسح الضوئي العامة
      const granted = await scannerPermissionService.requestPermission();
      console.log('useZXingBarcodeScanner: نتيجة طلب الإذن:', granted);
      
      setHasPermission(granted);
      setIsLoading(false);
      
      if (granted) {
        await Toast.show({
          text: 'تم منح إذن الكاميرا بنجاح!',
          duration: 'short'
        });
        
        // تفعيل الكاميرا مباشرة بعد منح الإذن
        setTimeout(() => {
          activateCamera();
        }, 500);
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
      setIsLoading(false);
      return false;
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
      
      // تأكيد على وجود الشاشة
      console.log('useZXingBarcodeScanner: التأكد من وجود الشاشة قبل تفعيل الكاميرا');
      
      // تفعيل الكاميرا بشكل مباشر
      let activated = false;
      
      if (Capacitor.isNativePlatform()) {
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          try {
            // إعداد الماسح
            console.log('MLKitBarcodeScanner: جاري التحقق من الدعم');
            const supported = await BarcodeScanner.isSupported();
            if (supported.supported) {
              console.log('MLKitBarcodeScanner مدعوم، جاري التهيئة...');
              
              // تهيئة الماسح للاستخدام
              await BarcodeScanner.enableTorch(false);
              
              // تم التهيئة بنجاح
              activated = true;
              console.log('تم تهيئة MLKitBarcodeScanner بنجاح');
            } else {
              console.error('MLKitBarcodeScanner غير مدعوم على هذا الجهاز');
              await Toast.show({
                text: 'ماسح الباركود غير مدعوم على هذا الجهاز',
                duration: 'short'
              });
            }
          } catch (e) {
            console.error('خطأ في تهيئة MLKitBarcodeScanner:', e);
            await Toast.show({
              text: 'خطأ في تفعيل الكاميرا، يرجى المحاولة مرة أخرى',
              duration: 'short'
            });
          }
        } else {
          // محاكاة نجاح تفعيل الكاميرا للتجربة على المنصات التي لا تدعم MLKit
          console.log('محاكاة تفعيل الكاميرا للتجربة');
          activated = true;
        }
      } else {
        // في بيئة الويب
        console.log('نحن في بيئة الويب، محاكاة تفعيل الكاميرا');
        activated = true;
      }
      
      setCameraActive(activated);
      setIsLoading(false);
      
      // عند نجاح تفعيل الكاميرا، ابدأ المسح تلقائياً
      if (activated) {
        console.log('useZXingBarcodeScanner: تم تفعيل الكاميرا، بدء المسح تلقائياً بعد تأخير قصير...');
        setTimeout(() => {
          startScan();
        }, 500);
      }
      
      return activated;
    } catch (error) {
      console.error('useZXingBarcodeScanner: خطأ في تفعيل الكاميرا:', error);
      setHasScannerError(true);
      setIsLoading(false);
      return false;
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
                await stopScanRef();
                if (result.barcodes && result.barcodes.length > 0) {
                  onScan(result.barcodes[0].rawValue || '');
                }
              } catch (e) {
                console.error('خطأ في معالجة نتيجة المسح:', e);
              }
            }
          );
          
          // بدء المسح باستخدام واجهة MLKit مباشرة
          // تصحيح الخطأ هنا - BarcodeScanner.startScan() لا يتوقع أي وسائط
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
        // في بيئة المحاكاة أو الويب
        console.log('المسح جاهز في بيئة المحاكاة، انتظار تحديد الباركود');
        
        // محاكاة نجاح عملية المسح للاختبار
        // في بيئة حقيقية، سيتم استخدام الكاميرا الفعلية
        setTimeout(() => {
          console.log('محاكاة اكتشاف باركود للاختبار');
          onScan('mock-barcode-123456789');
        }, 5000);
        
        return true;
      }
    } catch (error) {
      console.error('useZXingBarcodeScanner: خطأ في بدء المسح:', error);
      setIsScanningActive(false);
      setHasScannerError(true);
      return false;
    }
  }, [cameraActive, activateCamera, onScan, stopScanRef]);
  
  // Use our early reference to avoid the circular reference issue
  const stopScan = stopScanRef;
  
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
