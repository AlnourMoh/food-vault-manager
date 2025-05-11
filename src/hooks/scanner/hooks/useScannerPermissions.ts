
import { useState, useCallback, useEffect } from 'react';
import { Toast } from '@capacitor/toast';
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

export const useScannerPermissions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionDeniedCount, setPermissionDeniedCount] = useState(0);

  // تحقق من الأذونات عند تحميل الهوك
  useEffect(() => {
    checkPermission();
  }, []);

  // التحقق من وجود إذن الكاميرا
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

      // التحقق من إذن الكاميرا باستخدام MLKit أولاً
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const status = await BarcodeScanner.checkPermissions();
        console.log('[useScannerPermissions] حالة إذن MLKit:', status.camera);
        
        if (status.camera === 'granted') {
          setHasPermission(true);
          setIsLoading(false);
          return true;
        } else if (status.camera === 'denied') {
          setHasPermission(false);
          setIsLoading(false);
          return false;
        }
      }

      // محاولة استخدام ملحق الكاميرا الأساسي
      if (Capacitor.isPluginAvailable('Camera')) {
        const status = await Camera.checkPermissions();
        console.log('[useScannerPermissions] حالة إذن الكاميرا:', status.camera);
        
        if (status.camera === 'granted') {
          setHasPermission(true);
          setIsLoading(false);
          return true;
        } else if (status.camera === 'denied') {
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
  }, []);

  // طلب إذن الكاميرا
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

      let granted = false;
      
      // محاولة طلب الإذن باستخدام MLKit
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // نعيد تحميل حالة الإذن أولاً
        const currentStatus = await BarcodeScanner.checkPermissions();
        
        // إذا كان لدينا إذن بالفعل، نرجع true
        if (currentStatus.camera === 'granted') {
          console.log('[useScannerPermissions] لدينا إذن MLKit بالفعل');
          setHasPermission(true);
          setIsLoading(false);
          return true;
        }

        // طلب الإذن
        console.log('[useScannerPermissions] طلب إذن MLKit');
        const result = await BarcodeScanner.requestPermissions();
        granted = result.camera === 'granted';
        
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
      if (!granted && Capacitor.isPluginAvailable('Camera')) {
        // نتحقق من الحالة الحالية أولاً
        const currentStatus = await Camera.checkPermissions();
        
        // إذا كان لدينا إذن بالفعل، نرجع true
        if (currentStatus.camera === 'granted') {
          console.log('[useScannerPermissions] لدينا إذن الكاميرا بالفعل');
          setHasPermission(true);
          setIsLoading(false);
          return true;
        }
        
        // طلب الإذن
        console.log('[useScannerPermissions] طلب إذن الكاميرا');
        const result = await Camera.requestPermissions({
          permissions: ['camera']
        });
        
        granted = result.camera === 'granted';
        
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
        const shouldOpenSettings = window.confirm(
          'يبدو أن إذن الكاميرا مرفوض. هل ترغب في فتح إعدادات الجهاز لتمكينه يدوياً؟'
        );
        
        if (shouldOpenSettings && Capacitor.isNativePlatform()) {
          console.log('[useScannerPermissions] توجيه المستخدم إلى الإعدادات');
          // إعطاء وقت كافٍ لظهور الإشعارات قبل الانتقال إلى الإعدادات
          setTimeout(async () => {
            try {
              if (Capacitor.isPluginAvailable('App')) {
                // استخدام أسلوب فتح الإعدادات المتوفر في الإصدار الحالي
                await App.exitApp();
              }
            } catch (settingsError) {
              console.error('[useScannerPermissions] خطأ في فتح الإعدادات:', settingsError);
            }
          }, 1000);
        }
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
  }, [permissionDeniedCount]);

  return {
    isLoading,
    hasPermission,
    requestPermission,
    setHasPermission,
    checkPermission
  };
};
