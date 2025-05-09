
import { useState, useCallback, useEffect } from 'react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { useScannerCleanup } from './modules/useScannerCleanup';
import { useScannerPermission } from './modules/useScannerPermission';

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
  
  // Define stopScan early so we can reference it in useScannerActivation
  const stopScan = useCallback(async (): Promise<boolean> => {
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

  // Define startScan here so it can be used in useScannerActivation
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
          
          // بدء المسح باستخدام واجهة MLKit - FIX: don't pass any arguments
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
  }, [cameraActive, onScan, stopScan]);
  
  // Now that we've defined startScan, we can use it in other hooks
  const { checkPermissions, requestPermission } = useScannerPermission(setIsLoading, setHasPermission, setHasScannerError);
  
  // Declare activateCamera after startScan is defined
  const activateCamera = useCallback(async () => {
    try {
      if (cameraActive) {
        console.log('useScannerActivation: الكاميرا نشطة بالفعل');
        return true;
      }
      
      console.log('useScannerActivation: جاري محاولة تفعيل الكاميرا...');
      setIsLoading(true);
      
      // التحقق من وجود الإذن قبل محاولة تفعيل الكاميرا
      if (hasPermission !== true) {
        console.log('useScannerActivation: لا يمكن تفعيل الكاميرا بدون إذن، جاري طلب الإذن...');
        // طلب الإذن تلقائياً إذا لم يكن موجوداً
        const granted = await requestPermission();
        if (!granted) {
          console.error('useScannerActivation: لم يتم منح إذن الكاميرا');
          setIsLoading(false);
          return false;
        }
      }
      
      // تأكيد على وجود الشاشة
      console.log('useScannerActivation: التأكد من وجود الشاشة قبل تفعيل الكاميرا');
      
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
        console.log('useScannerActivation: تم تفعيل الكاميرا، بدء المسح تلقائياً بعد تأخير قصير...');
        setTimeout(() => {
          startScan();
        }, 500);
      }
      
      return activated;
    } catch (error) {
      console.error('useScannerActivation: خطأ في تفعيل الكاميرا:', error);
      setHasScannerError(true);
      setIsLoading(false);
      return false;
    }
  }, [cameraActive, hasPermission, requestPermission, setCameraActive, setIsLoading, setHasScannerError, startScan]);
  
  useEffect(() => {
    const initPermissions = async () => {
      await checkPermissions(autoStart, activateCamera);
    };
    
    initPermissions();
  }, [autoStart, checkPermissions, activateCamera]);
  
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
  
  // استخدام hook للتنظيف عند إلغاء تحميل المكون
  useScannerCleanup(isScanningActive, stopScan);
  
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
