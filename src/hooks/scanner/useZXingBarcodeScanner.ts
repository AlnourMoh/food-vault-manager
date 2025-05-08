
import { useState, useEffect, useCallback } from 'react';
import { zxingService } from '@/services/scanner/ZXingService';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { useToast } from '@/hooks/use-toast';

interface UseZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

export const useZXingBarcodeScanner = ({
  onScan,
  onClose,
  autoStart = true
}: UseZXingBarcodeScannerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  
  const { hasPermission, requestPermission } = useCameraPermissions();
  const { toast } = useToast();
  
  // وظيفة تفعيل الكاميرا - تم تحسينها للتأكد من تفعيل الكاميرا أولاً
  const activateCamera = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useZXingBarcodeScanner] بدء تفعيل الكاميرا...');
      setIsLoading(true);
      
      // التحقق من إذن الكاميرا إذا لم يكن مفعلاً
      if (hasPermission === false) {
        const granted = await requestPermission();
        if (!granted) {
          console.log('[useZXingBarcodeScanner] تم رفض إذن الكاميرا');
          setIsLoading(false);
          return false;
        }
      }
      
      // محاولة تفعيل الكاميرا
      try {
        // تأكد من دعم الماسح
        const isSupported = await zxingService.isSupported();
        if (!isSupported) {
          throw new Error('هذا الجهاز لا يدعم ماسح الباركود');
        }
        
        // طلب إذن الكاميرا عبر ZXing
        const { granted } = await zxingService.requestPermission();
        if (!granted) {
          throw new Error('تم رفض إذن الكاميرا');
        }
        
        // تفعيل الكاميرا بنجاح
        setCameraActive(true);
        setIsLoading(false);
        
        toast({
          title: "تم تفعيل الكاميرا",
          description: "يمكنك الآن مسح الباركود",
        });
        
        return true;
      } catch (error) {
        console.error('[useZXingBarcodeScanner] خطأ في تفعيل الكاميرا:', error);
        setHasScannerError(true);
        setIsLoading(false);
        
        toast({
          title: "تعذر تفعيل الكاميرا",
          description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
          variant: "destructive"
        });
        
        return false;
      }
    } catch (error) {
      console.error('[useZXingBarcodeScanner] خطأ غير متوقع:', error);
      setHasScannerError(true);
      setIsLoading(false);
      return false;
    }
  }, [hasPermission, requestPermission, toast]);
  
  // وظيفة بدء المسح - الآن تتأكد من تفعيل الكاميرا أولاً
  const startScan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useZXingBarcodeScanner] بدء عملية المسح...');
      
      // إذا لم تكن الكاميرا نشطة، قم بتفعيلها أولاً
      if (!cameraActive) {
        const cameraReady = await activateCamera();
        if (!cameraReady) {
          return false;
        }
      }
      
      // بدء المسح فقط إذا كانت الكاميرا نشطة
      const success = await zxingService.startScan({}, result => {
        console.log('[useZXingBarcodeScanner] تم مسح الكود:', result.text);
        setIsScanningActive(false);
        onScan(result.text);
      });
      
      setIsScanningActive(success);
      return success;
    } catch (error) {
      console.error('[useZXingBarcodeScanner] خطأ في بدء المسح:', error);
      setHasScannerError(true);
      setIsScanningActive(false);
      return false;
    }
  }, [cameraActive, activateCamera, onScan]);
  
  // وظيفة إيقاف المسح
  const stopScan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useZXingBarcodeScanner] إيقاف المسح...');
      await zxingService.stopScan();
      setIsScanningActive(false);
      return true;
    } catch (error) {
      console.error('[useZXingBarcodeScanner] خطأ في إيقاف المسح:', error);
      return false;
    }
  }, []);
  
  // وظيفة إعادة المحاولة بعد حدوث خطأ
  const handleRetry = useCallback(() => {
    setHasScannerError(false);
    activateCamera().then(success => {
      if (success && autoStart) {
        startScan();
      }
    });
  }, [activateCamera, startScan, autoStart]);
  
  // تفعيل الكاميرا عند تحميل المكون إذا كان autoStart مفعلاً
  useEffect(() => {
    if (autoStart) {
      activateCamera().then(success => {
        if (success) {
          startScan();
        }
      });
    }
    
    // تنظيف الموارد عند إلغاء تحميل المكون
    return () => {
      stopScan().catch(console.error);
      zxingService.dispose();
    };
  }, [autoStart, activateCamera, startScan, stopScan]);
  
  return {
    isLoading,
    hasPermission,
    isScanningActive,
    hasScannerError,
    cameraActive,
    startScan,
    stopScan,
    requestPermission,
    handleRetry
  };
};
