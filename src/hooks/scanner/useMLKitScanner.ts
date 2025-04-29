import { useState, useEffect, useRef } from 'react';
import { barcodeScannerService } from '@/services/BarcodeScannerService';
import { useToast } from '@/hooks/use-toast';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';

interface UseMLKitScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useMLKitScanner = ({ onScan, onClose }: UseMLKitScannerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  const isCleaning = useRef(false);
  const { toast } = useToast();
  
  // التنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log('[useMLKitScanner] تنظيف الموارد عند إلغاء التحميل');
      isCleaning.current = true;
      
      // إيقاف المسح وتنظيف الموارد
      stopScan().catch(e => 
        console.error('[useMLKitScanner] خطأ في إيقاف المسح عند التنظيف:', e)
      );
    };
  }, []);
  
  // التحقق من حالة إذن الكاميرا عند التحميل
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setIsLoading(true);
        console.log('[useMLKitScanner] التحقق من إذن الكاميرا...');
        
        // محاولة التحقق من الإذن باستخدام MLKit مباشرة
        const hasPermission = await barcodeScannerService.checkPermission();
        console.log('[useMLKitScanner] نتيجة فحص الإذن:', hasPermission);
        setHasPermission(hasPermission);
        
        // إذا لم يكن هناك إذن، نحاول طلبه تلقائيًا
        if (!hasPermission) {
          console.log('[useMLKitScanner] لا يوجد إذن، جاري الطلب...');
          await requestPermission();
        }
      } catch (error) {
        console.error('[useMLKitScanner] خطأ في التحقق من الأذونات:', error);
        // حتى في حالة الخطأ، نفترض أن الإذن غير موجود
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPermissions();
  }, []);
  
  // وظيفة طلب إذن الكاميرا - محسنة لضمان الوضوح
  const requestPermission = async () => {
    try {
      setIsLoading(true);
      console.log('[useMLKitScanner] محاولة طلب إذن الكاميرا...');
      
      // محاولة طلب الإذن بشكل مباشر باستخدام MLKit
      try {
        const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
        const { camera } = await BarcodeScanner.requestPermissions();
        
        console.log('[useMLKitScanner] نتيجة طلب الإذن:', camera);
        const granted = camera === 'granted';
        
        setHasPermission(granted);
        
        // عرض رسالة للمستخدم بناءً على نتيجة طلب الإذن
        const { Toast } = await import('@capacitor/toast');
        
        if (granted) {
          console.log('[useMLKitScanner] تم منح الإذن بنجاح');
          await Toast.show({
            text: "تم منح الإذن. يمكنك الآن استخدام الماسح الضوئي",
            duration: "short"
          });
        } else {
          console.log('[useMLKitScanner] تم رفض الإذن');
          await Toast.show({
            text: "تم رفض إذن الكاميرا. يرجى تمكينه من إعدادات الجهاز",
            duration: "long"
          });
          
          // محاولة فتح إعدادات التطبيق
          try {
            if (window.Capacitor?.getPlatform() === 'android') {
              const openSettings = window.confirm('هل تريد فتح إعدادات التطبيق لتمكين الكاميرا؟');
              if (openSettings) {
                await barcodeScannerService.openAppSettings();
              }
            }
          } catch (e) {
            console.error('[useMLKitScanner] خطأ في فتح الإعدادات:', e);
          }
        }
        
        return granted;
      } catch (error) {
        console.error('[useMLKitScanner] خطأ في استخدام BarcodeScanner:', error);
        
        // محاولة بديلة باستخدام barcodeScannerService
        const granted = await barcodeScannerService.requestPermission();
        setHasPermission(granted);
        
        if (!granted) {
          const { Toast } = await import('@capacitor/toast');
          await Toast.show({
            text: "تعذر الوصول للكاميرا. يرجى تمكين الإذن من إعدادات التطبيق",
            duration: "long"
          });
        }
        
        return granted;
      }
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في طلب الإذن:', error);
      setHasPermission(false);
      
      // رسالة خطأ للمستخدم في حال فشل كل المحاولات
      try {
        const { Toast } = await import('@capacitor/toast');
        await Toast.show({
          text: "حدث خ��أ أثناء محاولة طلب إذن الكاميرا",
          duration: "long"
        });
      } catch (e) {
        alert("حدث خطأ أثناء محاولة طلب إذن الكاميرا");
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // وظيفة معالجة المسح الناجح
  const handleSuccessfulScan = async (code: string) => {
    if (isCleaning.current) return;
    
    console.log('[useMLKitScanner] تم المسح بنجاح:', code);
    setLastScannedCode(code);
    setIsScanningActive(false);
    
    // استدعاء وظيفة النجاح مع الرمز
    onScan(code);
  };
  
  // وظيفة بدء المسح
  const startScan = async () => {
    if (isCleaning.current) return false;
    
    try {
      console.log('[useMLKitScanner] بدء المسح...');
      
      // التحقق من الإذن أولاً
      if (hasPermission !== true) {
        const granted = await requestPermission();
        if (!granted) {
          console.log('[useMLKitScanner] لا يوجد إذن للكاميرا');
          return false;
        }
      }
      
      // تعيين حالة المسح إلى نشط
      setIsScanningActive(true);
      setHasScannerError(false);
      
      // بدء عملية المسح الفعلية
      const success = await barcodeScannerService.startScan(handleSuccessfulScan);
      
      if (!success) {
        console.log('[useMLKitScanner] فشل في بدء المسح');
        setIsScanningActive(false);
        setHasScannerError(true);
        
        toast({
          title: "خطأ في المسح",
          description: "فشل في بدء الماسح الضوئي. حاول مرة أخرى أو استخدم الإدخال اليدوي.",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في بدء المسح:', error);
      setIsScanningActive(false);
      setHasScannerError(true);
      
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة بدء المسح",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  // وظيفة إيقاف المسح
  const stopScan = async () => {
    try {
      console.log('[useMLKitScanner] إيقاف المسح...');
      setIsScanningActive(false);
      await barcodeScannerService.stopScan();
      return true;
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في إيقاف المسح:', error);
      return false;
    }
  };
  
  // وظيفة التحويل إلى وضع الإدخال اليدوي
  const handleManualEntry = () => {
    console.log('[useMLKitScanner] التحويل إلى وضع الإدخال اليدوي');
    stopScan().catch(e => console.error('[useMLKitScanner] خطأ في إيقاف المسح:', e));
    setIsManualEntry(true);
  };
  
  // وظيفة إلغاء الإدخال اليدوي
  const handleManualCancel = () => {
    console.log('[useMLKitScanner] إلغاء وضع الإدخال اليدوي');
    setIsManualEntry(false);
  };
  
  // وظيفة إعادة المحاولة بعد الخطأ
  const handleRetry = async () => {
    console.log('[useMLKitScanner] إعادة المحاولة بعد الخطأ');
    setHasScannerError(false);
    return await startScan();
  };
  
  return {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    isManualEntry,
    hasScannerError,
    startScan,
    stopScan,
    requestPermission,
    handleManualEntry,
    handleManualCancel,
    handleRetry
  };
};
