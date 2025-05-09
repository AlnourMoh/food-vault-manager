
import { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';

export const useScannerPermission = (
  setIsLoading: (loading: boolean) => void,
  setHasPermission: (permission: boolean | null) => void,
  setHasScannerError: (error: boolean) => void
) => {
  // التحقق من الأذونات وتفعيل الكاميرا عند الضرورة
  const checkPermissions = useCallback(
    async (autoActivateCamera: boolean, activateCamera: () => Promise<boolean>) => {
      try {
        console.log('useScannerPermission: التحقق من أذونات الكاميرا');
        setIsLoading(true);

        // التحقق من بيئة التشغيل
        if (Capacitor.isNativePlatform()) {
          console.log('useScannerPermission: نحن على منصة أصلية');
          
          // التحقق من توفر الملحقات
          if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
            console.log('useScannerPermission: ملحق MLKitBarcodeScanner متاح');
            
            // استخدام ملحق BarcodeScanner للتحقق من الإذن
            const result = await BarcodeScanner.checkPermissions();
            const granted = result.camera === 'granted';
            
            console.log('useScannerPermission: نتيجة فحص الأذونات:', { 
              result, 
              granted 
            });
            
            setHasPermission(granted);
            setIsLoading(false);
            
            // تفعيل الكاميرا تلقائيًا إذا كان هناك إذن وكانت الخاصية autoActivateCamera مفعلة
            if (granted && autoActivateCamera) {
              console.log('useScannerPermission: لدينا إذن والتفعيل التلقائي مطلوب، سنقوم بتفعيل الكاميرا');
              await activateCamera();
            }
            
            return;
          }
          
          if (Capacitor.isPluginAvailable('Camera')) {
            console.log('useScannerPermission: ملحق Camera متاح');
            
            // استخدام ملحق Camera للتحقق من الإذن
            const result = await Camera.checkPermissions();
            const granted = result.camera === 'granted';
            
            console.log('useScannerPermission: نتيجة فحص الأذونات:', { 
              result, 
              granted 
            });
            
            setHasPermission(granted);
            setIsLoading(false);
            
            // تفعيل الكاميرا تلقائيًا إذا كان هناك إذن
            if (granted && autoActivateCamera) {
              console.log('useScannerPermission: لدينا إذن والتفعيل التلقائي مطلوب، سنقوم بتفعيل الكاميرا');
              await activateCamera();
            }
            
            return;
          }
        }

        // في بيئة الويب، نتحقق من الإذن باستخدام API الويب
        console.log('useScannerPermission: نحن في بيئة الويب، استخدام API الويب');
        
        try {
          // التحقق من توفر mediaDevices
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error('useScannerPermission: API الكاميرا غير متوفر في هذا المتصفح');
            setHasPermission(false);
            setIsLoading(false);
            return;
          }
          
          // التحقق من وجود الكاميرات
          const devices = await navigator.mediaDevices.enumerateDevices();
          const cameras = devices.filter(device => device.kind === 'videoinput');
          
          console.log('useScannerPermission: تم العثور على', cameras.length, 'كاميرا(ت)');
          
          if (cameras.length === 0) {
            console.error('useScannerPermission: لم يتم العثور على كاميرا متصلة بالجهاز');
            setHasPermission(false);
            setIsLoading(false);
            return;
          }
          
          // محاولة الوصول إلى الكاميرا للحصول على إذن
          console.log('useScannerPermission: محاولة الوصول إلى الكاميرا');
          
          await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
          });
          
          console.log('useScannerPermission: تم منح إذن الكاميرا');
          setHasPermission(true);
          
          // تفعيل الكاميرا تلقائيًا إذا كانت الخاصية autoActivateCamera مفعلة
          if (autoActivateCamera) {
            console.log('useScannerPermission: التفعيل التلقائي مطلوب، سنقوم بتفعيل الكاميرا');
            await activateCamera();
          }
        } catch (error) {
          console.error('useScannerPermission: خطأ في الوصول إلى الكاميرا:', error);
          setHasPermission(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('useScannerPermission: خطأ في التحقق من الأذونات:', error);
        setHasScannerError(true);
        setHasPermission(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setHasPermission, setHasScannerError]
  );

  // طلب الإذن
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      console.log('useScannerPermission: طلب إذن الكاميرا');
      setIsLoading(true);

      // التحقق من بيئة التشغيل
      if (Capacitor.isNativePlatform()) {
        console.log('useScannerPermission: نحن على منصة أصلية');
        
        // استخدام ملحق BarcodeScanner لطلب الإذن
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('useScannerPermission: استخدام ملحق MLKitBarcodeScanner لطلب الإذن');
          
          const result = await BarcodeScanner.requestPermissions();
          const granted = result.camera === 'granted';
          
          console.log('useScannerPermission: نتيجة طلب الإذن:', { 
            result, 
            granted 
          });
          
          setHasPermission(granted);
          setIsLoading(false);
          return granted;
        }
        
        // محاولة استخدام ملحق Camera
        if (Capacitor.isPluginAvailable('Camera')) {
          console.log('useScannerPermission: استخدام ملحق Camera لطلب الإذن');
          
          const result = await Camera.requestPermissions({
            permissions: ['camera']
          });
          const granted = result.camera === 'granted';
          
          console.log('useScannerPermission: نتيجة طلب الإذن:', { 
            result, 
            granted 
          });
          
          setHasPermission(granted);
          setIsLoading(false);
          return granted;
        }
      }

      // في بيئة الويب
      console.log('useScannerPermission: نحن في بيئة الويب، استخدام API الويب');
      
      // التحقق من توفر mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('useScannerPermission: API الكاميرا غير متوفر في هذا المتصفح');
        setHasPermission(false);
        setIsLoading(false);
        return false;
      }
      
      try {
        // محاولة الوصول إلى الكاميرا للحصول على إذن
        console.log('useScannerPermission: محاولة الوصول إلى الكاميرا');
        await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }
        });
        
        console.log('useScannerPermission: تم منح إذن الكاميرا');
        setHasPermission(true);
        setIsLoading(false);
        return true;
      } catch (error) {
        console.error('useScannerPermission: خطأ في الوصول إلى الكاميرا:', error);
        setHasPermission(false);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('useScannerPermission: خطأ في طلب الإذن:', error);
      setHasPermission(false);
      setHasScannerError(true);
      setIsLoading(false);
      return false;
    }
  }, [setIsLoading, setHasPermission, setHasScannerError]);

  return { checkPermissions, requestPermission };
};
