import { useState, useEffect } from 'react';
import { useCameraPermissions } from '../useCameraPermissions';
import { useScannerDevice } from './useScannerDevice';
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { App } from '@capacitor/app';
import { ToastAction } from '@/components/ui/toast';

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
      
      if (hasPermission === false) {
        console.log('[useScannerState] Requesting permission as it was denied');
        
        if (window.Capacitor) {
          try {
            const permissionGranted = await requestPermission(true);
            if (!permissionGranted) {
              console.log('[useScannerState] Permission still not granted after request');
              
              toast({
                title: "إذن الكاميرا مطلوب",
                description: "يجب تفعيل إذن الكاميرا في إعدادات التطبيق للاستمرار. انقر للانتقال إلى الإعدادات",
                variant: "destructive",
                action: (
                  <ToastAction 
                    onClick={() => {
                      try {
                        if (window.Capacitor?.getPlatform() === 'ios') {
                          App.exitApp();
                        } else {
                          App.getInfo().then((appInfo) => {
                            console.log('App info:', appInfo);
                            window.location.href = 'app-settings:';
                          });
                        }
                      } catch (e) {
                        console.error('Could not open settings URL:', e);
                      }
                    }}
                  >
                    إعدادات
                  </ToastAction>
                )
              });
              return false;
            }
          } catch (error) {
            console.error('[useScannerState] Error during permission request:', error);
            return false;
          }
        }
      }
      
      
      if (window.Capacitor) {
        try {
          const isSupported = await BarcodeScanner.isSupported();
          if (isSupported) {
            console.log('[useScannerState] MLKit scanner is supported');
          } else {
            console.log('[useScannerState] MLKit scanner is NOT supported');
            toast({
              title: "ماسح الباركود غير مدعوم",
              description: "يبدو أن جهازك لا يدعم مكتبة مسح الباركود، سيتم استخدام طريقة بديلة",
              variant: "default"
            });
          }
        } catch (error) {
          console.error('[useScannerState] Error checking if MLKit scanner is supported:', error);
        }
      }
      
      setIsScanningActive(true);
      await startDeviceScan(handleSuccessfulScan);
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
