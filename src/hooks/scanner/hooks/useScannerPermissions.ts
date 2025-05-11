
import { useState, useCallback, useEffect } from 'react';
import { Toast } from '@capacitor/toast';
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * هوك خاص بإدارة أذونات الماسح الضوئي
 */
export const useScannerPermissions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionDeniedCount, setPermissionDeniedCount] = useState(0);

  /**
   * التحقق من توفر الملحقات اللازمة
   */
  const checkPluginAvailability = useCallback(() => {
    const hasMLKit = Capacitor.isPluginAvailable('MLKitBarcodeScanner');
    const hasCamera = Capacitor.isPluginAvailable('Camera');
    return { hasMLKit, hasCamera };
  }, []);

  /**
   * التحقق من إذن الكاميرا باستخدام MLKit
   */
  const checkMLKitPermission = useCallback(async () => {
    try {
      const status = await BarcodeScanner.checkPermissions();
      console.log('[useScannerPermissions] حالة إذن MLKit:', status.camera);
      
      return {
        isGranted: status.camera === 'granted',
        isDenied: status.camera === 'denied'
      };
    } catch (error) {
      console.error('[useScannerPermissions] خطأ في التحقق من إذن MLKit:', error);
      return { isGranted: false, isDenied: false };
    }
  }, []);

  /**
   * التحقق من إذن الكاميرا باستخدام ملحق الكاميرا الأساسي
   */
  const checkCameraPermission = useCallback(async () => {
    try {
      const status = await Camera.checkPermissions();
      console.log('[useScannerPermissions] حالة إذن الكاميرا:', status.camera);
      
      return {
        isGranted: status.camera === 'granted',
        isDenied: status.camera === 'denied'
      };
    } catch (error) {
      console.error('[useScannerPermissions] خطأ في التحقق من إذن الكاميرا:', error);
      return { isGranted: false, isDenied: false };
    }
  }, []);

  /**
   * طلب إذن الكاميرا باستخدام MLKit
   */
  const requestMLKitPermission = useCallback(async () => {
    try {
      console.log('[useScannerPermissions] طلب إذن MLKit');
      const result = await BarcodeScanner.requestPermissions();
      return result.camera === 'granted';
    } catch (error) {
      console.error('[useScannerPermissions] خطأ في طلب إذن MLKit:', error);
      return false;
    }
  }, []);

  /**
   * طلب إذن الكاميرا باستخدام ملحق الكاميرا الأساسي
   */
  const requestCameraPermission = useCallback(async () => {
    try {
      console.log('[useScannerPermissions] طلب إذن الكاميرا');
      const result = await Camera.requestPermissions({
        permissions: ['camera']
      });
      return result.camera === 'granted';
    } catch (error) {
      console.error('[useScannerPermissions] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }, []);

  /**
   * عرض نافذة لفتح إعدادات التطبيق
   */
  const showOpenSettingsPrompt = useCallback(async () => {
    const shouldOpenSettings = window.confirm(
      'يبدو أن إذن الكاميرا مرفوض. هل ترغب في فتح إعدادات الجهاز لتمكينه يدوياً؟'
    );
    
    if (shouldOpenSettings && Capacitor.isNativePlatform()) {
      console.log('[useScannerPermissions] توجيه المستخدم إلى الإعدادات');
      
      // إعطاء وقت كافٍ لظهور الإشعارات قبل الانتقال إلى الإعدادات
      setTimeout(async () => {
        try {
          if (Capacitor.isPluginAvailable('App')) {
            // محاولة فتح إعدادات التطبيق
            if (BarcodeScanner && typeof BarcodeScanner.openSettings === 'function') {
              await BarcodeScanner.openSettings();
            } else {
              console.log('[useScannerPermissions] لا يمكن فتح الإعدادات مباشرة، إنهاء التطبيق');
              await App.exitApp();
            }
          }
        } catch (settingsError) {
          console.error('[useScannerPermissions] خطأ في فتح الإعدادات:', settingsError);
        }
      }, 1000);
    }
  }, []);

  /**
   * التحقق من وجود إذن الكاميرا
   */
  const checkPermission = useCallback(async () => {
    try {
      console.log('[useScannerPermissions] التحقق من إذن الكاميرا');
      setIsLoading(true);

      // لا يوجد حاجة للتحقق في بيئة غير محمولة
      if (!Capacitor.isNativePlatform()) {
        console.log('[useScannerPermissions] ليس في بيئة محمولة، تجاهل فحص الإذن');
        setHasPermission(true);
        setIsLoading(false);
        return true;
      }

      // التحقق من توفر الملحقات
      const { hasMLKit, hasCamera } = checkPluginAvailability();

      // محاولة استخدام MLKit أولاً
      if (hasMLKit) {
        const { isGranted, isDenied } = await checkMLKitPermission();
        
        if (isGranted) {
          setHasPermission(true);
          setIsLoading(false);
          return true;
        } else if (isDenied) {
          setHasPermission(false);
          setIsLoading(false);
          return false;
        }
      }

      // محاولة استخدام ملحق الكاميرا الأساسي
      if (hasCamera) {
        const { isGranted, isDenied } = await checkCameraPermission();
        
        if (isGranted) {
          setHasPermission(true);
          setIsLoading(false);
          return true;
        } else if (isDenied) {
          setHasPermission(false);
          setIsLoading(false);
          return false;
        }
      }

      // إذا لم نتمكن من التحقق، نفترض عدم وجود إذن
      console.log('[useScannerPermissions] لا يمكن التحقق من الإذن، افتراض عدم وجوده');
      setHasPermission(false);
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('[useScannerPermissions] خطأ في التحقق من الإذن:', error);
      setHasPermission(false);
      setIsLoading(false);
      return false;
    }
  }, [checkPluginAvailability, checkMLKitPermission, checkCameraPermission]);

  /**
   * طلب إذن الكاميرا
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useScannerPermissions] طلب إذن الكاميرا...');
      setIsLoading(true);
      
      // إظهار إشعار للمستخدم
      await Toast.show({
        text: 'جاري طلب إذن الكاميرا...',
        duration: 'short'
      });
      
      // تسجيل محاولة جديدة لطلب الإذن
      setPermissionDeniedCount(prev => prev + 1);
      
      // في بيئة الويب، نفترض وجود الإذن (سيتم طلبه عند تشغيل الكاميرا)
      if (!Capacitor.isNativePlatform()) {
        console.log('[useScannerPermissions] في بيئة الويب، سنفترض وجود الإذن');
        setHasPermission(true);
        setIsLoading(false);
        return true;
      }

      // التحقق من توفر الملحقات
      const { hasMLKit, hasCamera } = checkPluginAvailability();
      let granted = false;
      
      // محاولة طلب الإذن باستخدام MLKit
      if (hasMLKit) {
        // التحقق من الحالة الحالية أولاً
        const { isGranted } = await checkMLKitPermission();
        
        if (isGranted) {
          console.log('[useScannerPermissions] لدينا إذن MLKit بالفعل');
          setHasPermission(true);
          setIsLoading(false);
          return true;
        }

        // طلب الإذن
        granted = await requestMLKitPermission();
        
        if (granted) {
          setHasPermission(true);
          setPermissionDeniedCount(0);
          setIsLoading(false);
          
          await Toast.show({
            text: 'تم منح إذن الكاميرا',
            duration: 'short'
          });
          
          return true;
        }
      }

      // إذا لم ننجح في MLKit، نجرب ملحق الكاميرا
      if (!granted && hasCamera) {
        // التحقق من الحالة الحالية أولاً
        const { isGranted } = await checkCameraPermission();
        
        if (isGranted) {
          console.log('[useScannerPermissions] لدينا إذن الكاميرا بالفعل');
          setHasPermission(true);
          setIsLoading(false);
          return true;
        }
        
        // طلب الإذن
        granted = await requestCameraPermission();
        
        if (granted) {
          setHasPermission(true);
          setPermissionDeniedCount(0);
          setIsLoading(false);
          
          await Toast.show({
            text: 'تم منح إذن الكاميرا',
            duration: 'short'
          });
          
          return true;
        }
      }
      
      // إذا وصلنا إلى هنا، فقد تم رفض الإذن
      setHasPermission(false);
      setIsLoading(false);
      
      // عرض رسالة للمستخدم
      await Toast.show({
        text: 'لم يتم منح إذن الكاميرا. يرجى تمكينه من إعدادات الجهاز.',
        duration: 'long'
      });
      
      // إذا تم رفض الإذن أكثر من مرة، نقترح فتح الإعدادات
      if (permissionDeniedCount >= 2) {
        await showOpenSettingsPrompt();
      }
      
      return false;
    } catch (error) {
      console.error('[useScannerPermissions] خطأ في طلب الإذن:', error);
      setHasPermission(false);
      setIsLoading(false);
      
      // عرض رسالة خطأ
      await Toast.show({
        text: 'حدث خطأ أثناء طلب إذن الكاميرا',
        duration: 'short'
      });
      
      return false;
    }
  }, [checkPluginAvailability, checkMLKitPermission, checkCameraPermission, requestMLKitPermission, requestCameraPermission, permissionDeniedCount, showOpenSettingsPrompt]);

  // تحقق من الأذونات عند تحميل الهوك
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    isLoading,
    hasPermission,
    requestPermission,
    setHasPermission,
    checkPermission
  };
};
