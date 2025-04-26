
import { useState, useEffect } from 'react';
import { useCameraPermissions } from '../useCameraPermissions';
import { useScannerDevice } from './useScannerDevice';
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
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
  
  useEffect(() => {
    setIsLoading(permissionsLoading);
  }, [permissionsLoading]);
  
  const handleSuccessfulScan = (code: string) => {
    console.log('[useScannerState] نجحت عملية المسح برمز:', code);
    setLastScannedCode(code);
    stopScan();
    onScan(code);
  };
  
  const startScan = async () => {
    try {
      console.log('[useScannerState] بدء المسح الآن...');
      
      // إلغاء أي مسح نشط حالي
      await stopDeviceScan();
      
      // تفعيل حالة المسح فوراً لإظهار واجهة المسح
      setIsScanningActive(true);
      
      // التحقق من الأذونات وطلبها فوراً إذا لزم الأمر
      if (hasPermission === false) {
        console.log('[useScannerState] طلب إذن الكاميرا');
        
        // نستخدم BarcodeScanner مباشرة للحصول على الإذن
        if (window.Capacitor) {
          try {
            const result = await BarcodeScanner.requestPermissions();
            console.log('[useScannerState] نتيجة طلب إذن الكاميرا:', result);
            
            if (result.camera !== 'granted') {
              console.log('[useScannerState] ما زال الإذن غير ممنوح');
              
              toast({
                title: "إذن الكاميرا مطلوب",
                description: "يجب تفعيل إذن الكاميرا في إعدادات التطبيق للاستمرار.",
                variant: "destructive",
                action: <ToastAction 
                  onClick={() => {
                    try {
                      if (window.Capacitor?.getPlatform() === 'ios') {
                        App.exitApp();
                      } else {
                        window.location.href = 'app-settings:';
                      }
                    } catch (e) {
                      console.error('Could not open settings URL:', e);
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
          } catch (error) {
            console.error('[useScannerState] خطأ في طلب إذن الكاميرا:', error);
          }
        } else {
          // طلب الإذن باستخدام آلية الإذن العامة
          const permissionGranted = await requestPermission(true);
          
          if (!permissionGranted) {
            console.log('[useScannerState] ما زال الإذن غير ممنوح بعد الطلب');
            setIsScanningActive(false);
            return false;
          }
        }
      }
      
      // التحقق من جاهزية الماسح وبدء المسح فوراً
      console.log('[useScannerState] بدء عملية المسح الفعلية');
      const success = await startDeviceScan(handleSuccessfulScan);
      
      if (!success) {
        console.log('[useScannerState] فشل بدء المسح');
        setIsScanningActive(false);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[useScannerState] خطأ في بدء المسح:', error);
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة بدء المسح. حاول استخدام الإدخال اليدوي بدلاً من ذلك",
        variant: "destructive"
      });
      setIsScanningActive(false);
      return false;
    }
  };
  
  const stopScan = async () => {
    console.log('[useScannerState] إيقاف المسح');
    setIsScanningActive(false);
    await stopDeviceScan();
  };
  
  useEffect(() => {
    return () => {
      stopScan();
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
