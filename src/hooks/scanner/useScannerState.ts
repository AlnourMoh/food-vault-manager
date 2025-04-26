
import { useState, useEffect } from 'react';
import { useCameraPermissions } from '../useCameraPermissions';
import { useScannerDevice } from './useScannerDevice';
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { App } from '@capacitor/app';

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
    // Update our loading state based on permissions loading
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
      
      // If we don't have permission, try to request it
      if (hasPermission === false) {
        console.log('[useScannerState] Requesting permission as it was denied');
        
        // Using Capacitor App API to try opening settings if available
        if (window.Capacitor) {
          try {
            const permissionGranted = await requestPermission(true);
            if (!permissionGranted) {
              console.log('[useScannerState] Permission still not granted after request');
              
              // Show more helpful toast with instructions
              toast({
                title: "إذن الكاميرا مطلوب",
                description: "يجب تفعيل إذن الكاميرا في إعدادات التطبيق للاستمرار. انقر للانتقال إلى الإعدادات",
                variant: "destructive",
                action: {
                  altText: "إعدادات",
                  onClick: () => {
                    // Try to direct user to app settings if possible
                    try {
                      // Use the correct method to open app settings URL
                      if (window.Capacitor?.getPlatform() === 'ios') {
                        App.exitApp();
                      } else {
                        // For Android and others, try a universal approach
                        App.getInfo().then((appInfo) => {
                          console.log('App info:', appInfo);
                          // This is a fallback approach as direct settings URLs may not work on all devices
                          window.location.href = 'app-settings:';
                        });
                      }
                    } catch (e) {
                      console.error('Could not open settings URL:', e);
                    }
                  },
                  children: "إعدادات"
                }
              });
              return false;
            }
          } catch (error) {
            console.error('[useScannerState] Error during permission request:', error);
            return false;
          }
        } else {
          // Web environment permission handling
          const permissionGranted = await requestPermission(true);
          if (!permissionGranted) {
            console.log('[useScannerState] Browser denied camera permission');
            toast({
              title: "إذن الكاميرا مطلوب",
              description: "يرجى السماح للموقع باستخدام الكاميرا من إعدادات المتصفح",
              variant: "destructive"
            });
            return false;
          }
        }
      }
      
      // Check if MLKit scanner is available on this device
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
      
      // Start the scan
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
