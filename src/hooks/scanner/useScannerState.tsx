
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
      console.log('[useScannerState] محاولة بدء المسح، حالة الإذن:', hasPermission);
      
      // نتأكد أولاً من إلغاء أي مسح نشط حالي
      await stopDeviceScan();
      
      // التحقق من الأذونات وطلبها إذا لزم الأمر
      if (hasPermission === false) {
        console.log('[useScannerState] طلب الإذن لأنه تم رفضه');
        const permissionGranted = await requestPermission(true);
        
        if (!permissionGranted) {
          console.log('[useScannerState] ما زال الإذن غير ممنوح بعد الطلب');
          
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
          return false;
        }
      }
      
      // فحص توفر الماسح
      console.log('[useScannerState] جاري فحص توفر الماسح...');
      
      // فحص دعم الجهاز للمسح
      let isSupported = false;
      if (window.Capacitor) {
        try {
          const supportResult = await BarcodeScanner.isSupported();
          isSupported = supportResult.supported;
          console.log('[useScannerState] هل ماسح الباركود مدعوم:', isSupported);
          
          if (!isSupported) {
            console.log('[useScannerState] ماسح الباركود غير مدعوم');
            toast({
              title: "ماسح الباركود غير مدعوم",
              description: "سيتم استخدام طريقة الإدخال اليدوي بدلاً من ذلك",
              variant: "default"
            });
          }
        } catch (error) {
          console.error('[useScannerState] خطأ في فحص دعم الماسح:', error);
        }
      }
      
      // تفعيل المسح
      setIsScanningActive(true);
      const success = await startDeviceScan(handleSuccessfulScan);
      
      // إذا فشل المسح، نعيد الواجهة إلى حالتها السابقة
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
