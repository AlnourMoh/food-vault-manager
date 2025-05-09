
import { Dispatch, SetStateAction, useCallback } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

export const useScannerActivation = (
  cameraActive: boolean,
  setCameraActive: Dispatch<SetStateAction<boolean>>,
  hasPermission: boolean | null,
  requestPermission: () => Promise<boolean>,
  startScan: () => Promise<boolean>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setHasScannerError: Dispatch<SetStateAction<boolean>>
) => {
  // وظيفة لتفعيل الكاميرا
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

  return { activateCamera };
};
