
import { useState, useEffect } from 'react';
import { useCameraPermissions } from '../useCameraPermissions';
import { useScannerDevice } from './useScannerDevice';
import { useToast } from '@/hooks/use-toast';
import { App } from '@capacitor/app';
import { ToastAction } from '@/components/ui/toast';
import React from 'react';

interface UseScannerStateProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useScannerState = ({ onScan, onClose }: UseScannerStateProps) => {
  const { isLoading: permissionsLoading, hasPermission, requestPermission } = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const { startDeviceScan, stopDeviceScan } = useScannerDevice();
  const { toast } = useToast();
  
  // تتبع حالة التحميل من خلال حالة الأذونات
  useEffect(() => {
    setIsLoading(permissionsLoading);
  }, [permissionsLoading]);
  
  // تنظيف عند إزالة المكون
  useEffect(() => {
    return () => {
      console.log('[useScannerState] تنظيف عند الإزالة');
      stopScan().catch(e => 
        console.error('[useScannerState] خطأ أثناء إيقاف المسح عند الإزالة:', e)
      );
    };
  }, []);
  
  const handleSuccessfulScan = (code: string) => {
    console.log('[useScannerState] تم المسح بنجاح:', code);
    setLastScannedCode(code);
    setIsScanningActive(false);
    
    // استخدام timeout صغير لضمان انتهاء تنظيف المسح قبل نقل النتيجة
    setTimeout(() => {
      onScan(code);
    }, 100);
  };
  
  const startScan = async () => {
    try {
      console.log('[useScannerState] بدء المسح');
      // إيقاف أي عملية مسح نشطة حالياً
      await stopDeviceScan().catch(e => console.warn('[useScannerState] خطأ في إيقاف المسح قبل البدء:', e));
      
      // تفعيل واجهة المسح فوراً لتجربة مستخدم أفضل
      setIsScanningActive(true);
      
      // التحقق من الأذونات
      if (hasPermission === false) {
        console.log('[useScannerState] طلب إذن الكاميرا');
        const granted = await requestPermission(true);
        console.log('[useScannerState] نتيجة طلب الإذن:', granted);
        
        if (!granted) {
          console.log('[useScannerState] لم يتم منح الإذن');
          
          toast({
            title: "إذن الكاميرا مطلوب",
            description: "يجب تفعيل إذن الكاميرا في إعدادات التطبيق للاستمرار.",
            variant: "destructive",
            action: <ToastAction 
              onClick={() => {
                try {
                  // محاولة فتح إعدادات التطبيق
                  if (window.Capacitor?.getPlatform() === 'ios') {
                    App.exitApp();
                  } else if (window.Capacitor?.getPlatform() === 'android') {
                    // للأندرويد، يمكننا محاولة فتح إعدادات التطبيق
                    window.open('package:settings', '_system');
                  }
                } catch (e) {
                  console.error('Could not open settings:', e);
                }
              }}
              altText="إعدادات"
            >
              إعدادات
            </ToastAction>
          });
          
          setIsScanningActive(false);
          return false;
        }
      }
      
      // بدء عملية المسح بعد التحقق من الأذونات
      console.log('[useScannerState] بدء عملية المسح الفعلية');
      const success = await startDeviceScan(handleSuccessfulScan);
      
      if (!success) {
        console.log('[useScannerState] فشلت عملية بدء المسح');
        setIsScanningActive(false);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[useScannerState] خطأ في بدء المسح:', error);
      
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة بدء المسح. حاول مرة أخرى أو استخدم الإدخال اليدوي.",
        variant: "destructive"
      });
      
      setIsScanningActive(false);
      return false;
    }
  };
  
  const stopScan = async () => {
    console.log('[useScannerState] إيقاف المسح');
    setIsScanningActive(false);
    
    try {
      await stopDeviceScan();
    } catch (error) {
      console.error('[useScannerState] خطأ أثناء إيقاف المسح:', error);
    }
    
    return true;
  };
  
  // تنظيف عند الخروج
  useEffect(() => {
    return () => {
      stopScan().catch(e => console.error('[useScannerState] خطأ أثناء التنظيف عند الإزالة:', e));
    };
  }, []);
  
  return {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan
  };
};
