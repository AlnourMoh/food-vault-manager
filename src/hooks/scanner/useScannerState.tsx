
import { useState, useEffect } from 'react';
import { useCameraPermissions } from '../useCameraPermissions';
import { useScannerDevice } from './useScannerDevice';
import { useToast } from '@/hooks/use-toast';

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
  
  // حالة الإلغاء (لتجنب تحديثات الحالة بعد إلغاء المكون)
  const [isCancelled, setIsCancelled] = useState(false);
  
  // تتبع حالة التحميل من خلال حالة الأذونات
  useEffect(() => {
    if (!isCancelled) {
      setIsLoading(permissionsLoading);
    }
  }, [permissionsLoading, isCancelled]);
  
  // تنظيف عند إزالة المكون
  useEffect(() => {
    return () => {
      console.log('[useScannerState] تنظيف عند الإزالة');
      setIsCancelled(true);
      stopScan().catch(e => 
        console.error('[useScannerState] خطأ أثناء إيقاف المسح عند الإزالة:', e)
      );
    };
  }, []);
  
  // معالجة المسح الناجح
  const handleSuccessfulScan = (code: string) => {
    if (isCancelled) return;
    
    console.log('[useScannerState] تم المسح بنجاح:', code);
    setLastScannedCode(code);
    setIsScanningActive(false);
    
    // استخدام timeout صغير لضمان انتهاء تنظيف المسح قبل نقل النتيجة
    setTimeout(() => {
      if (!isCancelled) {
        onScan(code);
      }
    }, 200);
  };
  
  // بدء عملية المسح
  const startScan = async () => {
    if (isCancelled) return false;
    
    try {
      console.log('[useScannerState] بدء المسح');
      
      // إيقاف أي عملية مسح نشطة حالياً
      await stopDeviceScan().catch(e => 
        console.warn('[useScannerState] خطأ في إيقاف المسح قبل البدء:', e)
      );
      
      // تفعيل حالة المسح النشط لواجهة المستخدم
      setIsScanningActive(true);
      
      // التحقق من الأذونات
      if (hasPermission === false) {
        console.log('[useScannerState] طلب إذن الكاميرا');
        const granted = await requestPermission();
        console.log('[useScannerState] نتيجة طلب الإذن:', granted);
        
        if (!granted) {
          console.log('[useScannerState] لم يتم منح الإذن');
          
          if (!isCancelled) {
            toast({
              title: "إذن الكاميرا مطلوب",
              description: "يجب تفعيل إذن الكاميرا في إعدادات التطبيق للاستمرار.",
              variant: "destructive"
            });
            
            setIsScanningActive(false);
          }
          return false;
        }
      }
      
      // بدء عملية المسح الفعلية بعد التأكد من الأذونات
      console.log('[useScannerState] بدء عملية المسح الفعلية');
      const success = await startDeviceScan((code) => {
        if (!isCancelled) {
          handleSuccessfulScan(code);
        }
      });
      
      if (!success && !isCancelled) {
        console.log('[useScannerState] فشلت عملية بدء المسح');
        setIsScanningActive(false);
        return false;
      }
      
      return true;
    } catch (error) {
      if (isCancelled) return false;
      
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
  
  // إيقاف عملية المسح
  const stopScan = async () => {
    console.log('[useScannerState] إيقاف المسح');
    
    if (!isCancelled) {
      setIsScanningActive(false);
    }
    
    try {
      await stopDeviceScan();
      return true;
    } catch (error) {
      console.error('[useScannerState] خطأ أثناء إيقاف المسح:', error);
      return false;
    }
  };
  
  return {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan
  };
};
