import { useState, useEffect, useCallback } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { useScannerActivation } from './modules/useScannerActivation';
import { useBarcodeScanning } from './modules/useBarcodeScanning';
import { useScannerRetry } from './modules/useScannerRetry';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { useToast } from '@/hooks/use-toast';

interface UseZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

export const useZXingBarcodeScannerHook = ({ 
  onScan, 
  onClose, 
  autoStart = true 
}: UseZXingBarcodeScannerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const { toast } = useToast();
  
  // استخدام خطاف تفعيل الماسح
  const { requestCamera, stopCamera } = useScannerActivation({
    onStart: () => setCameraActive(true),
    onStop: () => setCameraActive(false),
    onError: (error) => setScannerError(error)
  });
  
  // استخدام خطاف المسح الضوئي للباركود
  const { startScan, stopScan } = useBarcodeScanning({
    onScan,
    onScanError: (error) => setScannerError(error ? "حدث خطأ في الماسح الضوئي" : null),
    onScanComplete: () => {
      console.log('Scan completed successfully');
      setIsScanningActive(false); // We can handle this state internally
    }
  });
  
  // تعريف وظيفة تفعيل الكاميرا التي ترجع Promise<boolean>
  const activateCamera = useCallback(async (): Promise<boolean> => {
    try {
      console.log('useZXingBarcodeScanner: محاولة تفعيل الكاميرا...');
      const result = await requestCamera();
      return result;
    } catch (error) {
      console.error('useZXingBarcodeScanner: خطأ في تفعيل الكاميرا:', error);
      return false;
    }
  }, [requestCamera]);
  
  // استخدام خطاف إعادة المحاولة للماسح
  const { handleRetry } = useScannerRetry({
    setHasScannerError: (error) => setScannerError(error ? "حدث خطأ في الماسح الضوئي" : null),
    setCameraActive,
    activateCamera,
    startScan
  });
  
  // فحص الأذونات وتفعيل الكاميرا عند الحاجة
  useEffect(() => {
    const checkPermissionsAndActivate = async () => {
      try {
        setIsLoading(true);
        console.log('useZXingBarcodeScanner: التحقق من أذونات الكاميرا...');
        
        // التحقق من دعم الماسح الضوئي
        const isSupported = await scannerPermissionService.isSupported();
        if (!isSupported) {
          console.error('useZXingBarcodeScanner: الماسح الضوئي غير مدعوم على هذا الجهاز');
          setHasPermission(false);
          setScannerError('الماسح الضوئي غير مدعوم على هذا الجهاز');
          setIsLoading(false);
          return;
        }
        
        // التحقق من حالة إذن الكاميرا
        const permission = await scannerPermissionService.checkPermission();
        console.log('useZXingBarcodeScanner: حالة إذن الكاميرا:', permission);
        setHasPermission(permission);
        
        if (permission) {
          // إذا كان لدينا إذن وتم تمكين التشغيل التلقائي، نقوم بتفعيل الكاميرا
          if (autoStart) {
            console.log('useZXingBarcodeScanner: تفعيل الكاميرا تلقائيًا');
            const activated = await activateCamera();
            if (!activated) {
              console.error('useZXingBarcodeScanner: فشل تفعيل الكاميرا');
              setScannerError('فشل تفعيل الكاميرا');
            }
          }
        } else {
          console.log('useZXingBarcodeScanner: الإذن غير ممنوح، الانتظار للطلب الصريح');
          // نعرض واجهة طلب الإذن من المستخدم
          if (Capacitor.isNativePlatform()) {
            toast({
              title: "إذن الكاميرا مطلوب",
              description: "يجب السماح بالوصول إلى الكاميرا لاستخدام الماسح الضوئي"
            });
          }
        }
      } catch (error) {
        console.error('useZXingBarcodeScanner: خطأ أثناء التحقق من الأذونات:', error);
        setScannerError('حدث خطأ أثناء التحقق من أذونات الكاميرا');
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPermissionsAndActivate();
  }, [autoStart, toast, activateCamera]);
  
  // تنظيف الموارد عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log("useZXingBarcodeScanner: تنظيف موارد الماسح عند الإلغاء");
      
      // إيقاف المسح إذا كان نشطًا
      if (isScanningActive) {
        stopScan().catch(error => {
          console.error("useZXingBarcodeScanner: خطأ في إيقاف المسح:", error);
        });
      }
      
      // إزالة جميع المستمعين
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        BarcodeScanner.removeAllListeners().catch(error => {
          console.error("useZXingBarcodeScanner: خطأ في إزالة المستمعين:", error);
        });
      }
    };
  }, [isScanningActive, stopScan]);

  // وظيفة طلب الإذن التي ترجع Promise<boolean>
  const requestPermission = async (): Promise<boolean> => {
    try {
      console.log('useZXingBarcodeScanner: طلب إذن الكاميرا...');
      const permission = await scannerPermissionService.requestPermission();
      console.log('useZXingBarcodeScanner: نتيجة طلب الإذن:', permission);
      
      // تحديث حالة الإذن
      setHasPermission(permission);
      
      // محاولة تفعيل الكاميرا إذا تم منح الإذن
      if (permission) {
        console.log('useZXingBarcodeScanner: تم منح الإذن، محاولة تفعيل الكاميرا');
        const activated = await activateCamera();
        if (!activated) {
          console.error('useZXingBarcodeScanner: فشل تفعيل الكاميرا بعد منح الإذن');
          setScannerError('فشل تفعيل الكاميرا بعد منح الإذن');
          return false;
        }
        return true;
      }
      
      return permission;
    } catch (error) {
      console.error('useZXingBarcodeScanner: خطأ في طلب إذن الكاميرا:', error);
      setHasPermission(false);
      setScannerError('حدث خطأ أثناء طلب إذن الكاميرا');
      return false;
    }
  };

  return {
    isLoading,
    hasPermission,
    cameraActive,
    scannerError,
    requestPermission: async (): Promise<boolean> => {
      try {
        const permission = await scannerPermissionService.requestPermission();
        setHasPermission(permission);
        return permission;
      } catch (error) {
        console.error('useZXingBarcodeScanner: خطأ في طلب الإذن:', error);
        return false;
      }
    },
    handleRetry
  };
};
