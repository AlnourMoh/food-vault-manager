import { useState, useCallback, useEffect, useRef } from 'react';
import { zxingService } from '@/services/scanner/ZXingService';
import { ZXingScanResult } from '@/types/zxing-scanner';
import { useToast } from '@/hooks/use-toast';
import { useScannerUI } from '@/hooks/scanner/useScannerUI';

interface UseZXingScannerProps {
  onScan?: (code: string) => void;
  onClose?: () => void;
  autoStart?: boolean;
}

export const useZXingScanner = ({ 
  onScan, 
  onClose, 
  autoStart = false 
}: UseZXingScannerProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [hasScannerError, setHasScannerError] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  
  const { toast } = useToast();
  const { setupScannerBackground, restoreUIAfterScanning } = useScannerUI();
  
  const isMountedRef = useRef(true);
  
  // التحقق من الحالة عند التحميل وبدء المسح تلقائياً إذا تم تفعيل الخيار
  useEffect(() => {
    const checkSupportAndPermission = async () => {
      try {
        setIsLoading(true);
        
        // التحقق أولاً من الدعم
        const isSupported = await zxingService.isSupported();
        if (!isSupported) {
          setHasPermission(false);
          return;
        }
        
        // التحقق من الإذن
        const permissionStatus = await zxingService.requestPermission();
        setHasPermission(permissionStatus.granted);
        
        // بدء المسح تلقائياً إذا تم منح الإذن وتم تفعيل خيار البدء التلقائي
        if (permissionStatus.granted && autoStart) {
          console.log('[useZXingScanner] تم منح الإذن، بدء المسح تلقائياً...');
          await startScan();
        }
      } catch (error) {
        console.error('[useZXingScanner] خطأ في التحقق من الدعم والإذن:', error);
        setHasPermission(false);
        setHasScannerError(true);
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };
    
    checkSupportAndPermission();
    
    // التنظيف عند إلغاء تحميل المكون
    return () => {
      isMountedRef.current = false;
      stopScan();
    };
  }, [autoStart]);
  
  /**
   * طلب إذن الكاميرا
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const permissionStatus = await zxingService.requestPermission();
      
      if (isMountedRef.current) {
        setHasPermission(permissionStatus.granted);
      }
      
      if (!permissionStatus.granted && permissionStatus.error) {
        toast({
          title: "لم يتم الحصول على إذن الكاميرا",
          description: permissionStatus.error,
          variant: "destructive"
        });
      }
      
      return permissionStatus.granted;
    } catch (error) {
      console.error('[useZXingScanner] خطأ في طلب الإذن:', error);
      
      if (isMountedRef.current) {
        setHasPermission(false);
      }
      
      toast({
        title: "خطأ في طلب إذن الكاميرا",
        description: "حدث خطأ أثناء محاولة طلب إذن الكاميرا",
        variant: "destructive"
      });
      
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [toast]);
  
  /**
   * معالجة نتيجة المسح
   */
  const handleScanResult = useCallback((result: ZXingScanResult) => {
    if (!isMountedRef.current) return;
    
    if (result && result.text) {
      setLastScannedCode(result.text);
      
      if (onScan) {
        onScan(result.text);
      }
      
      return true;
    }
    
    return false;
  }, [onScan]);
  
  /**
   * بدء المسح
   */
  const startScan = useCallback(async (): Promise<boolean> => {
    try {
      if (isScanningActive) {
        console.log('[useZXingScanner] الماسح نشط بالفعل');
        return true;
      }
      
      setIsLoading(true);
      setHasScannerError(false);
      
      // التحقق من الإذن وطلبه إذا لزم الأمر
      if (hasPermission !== true) {
        const granted = await requestPermission();
        if (!granted) {
          setIsLoading(false);
          return false;
        }
      }
      
      // إعداد واجهة المستخدم للمسح
      await setupScannerBackground();
      
      if (!isMountedRef.current) return false;
      
      setIsScanningActive(true);
      
      // بدء المسح
      const success = await zxingService.startScan({
        tryHarder: true,
        delayBetweenScanAttempts: 500
      }, handleScanResult);
      
      if (!isMountedRef.current) return false;
      
      if (!success) {
        setHasScannerError(true);
        setIsScanningActive(false);
        
        toast({
          title: "فشل في بدء المسح",
          description: "حدث خطأ أثناء محاولة بدء الماسح الضوئي",
          variant: "destructive"
        });
        
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[useZXingScanner] خطأ في بدء المسح:', error);
      
      if (isMountedRef.current) {
        setHasScannerError(true);
        setIsScanningActive(false);
        
        toast({
          title: "خطأ في الماسح الضوئي",
          description: "حدث خطأ غير متوقع أثناء بدء المسح",
          variant: "destructive"
        });
      }
      
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [hasPermission, isScanningActive, requestPermission, handleScanResult, setupScannerBackground, toast]);
  
  /**
   * إيقاف المسح
   */
  const stopScan = useCallback(async (): Promise<void> => {
    try {
      if (!isScanningActive) {
        return;
      }
      
      await zxingService.stopScan();
      await restoreUIAfterScanning();
      
      if (isMountedRef.current) {
        setIsScanningActive(false);
      }
    } catch (error) {
      console.error('[useZXingScanner] خطأ في إيقاف المسح:', error);
      
      if (isMountedRef.current) {
        setIsScanningActive(false);
      }
    }
  }, [isScanningActive, restoreUIAfterScanning]);
  
  /**
   * التبديل إلى الإدخال اليدوي
   */
  const handleManualEntry = useCallback(() => {
    setIsManualEntry(true);
    stopScan();
  }, [stopScan]);
  
  /**
   * إلغاء الإدخال اليدوي
   */
  const handleManualCancel = useCallback(() => {
    setIsManualEntry(false);
  }, []);
  
  /**
   * إعادة المحاولة بعد الخطأ
   */
  const handleRetry = useCallback(() => {
    setHasScannerError(false);
    startScan();
  }, [startScan]);
  
  /**
   * مسح من صورة
   */
  const scanFromImage = useCallback(async (imageSource: string | Blob | File): Promise<string | null> => {
    try {
      setIsLoading(true);
      
      const result = await zxingService.scanFromImage(imageSource);
      
      if (result && result.text) {
        setLastScannedCode(result.text);
        
        if (onScan) {
          onScan(result.text);
        }
        
        return result.text;
      }
      
      return null;
    } catch (error) {
      console.error('[useZXingScanner] خطأ في مسح الصورة:', error);
      return null;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [onScan]);
  
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
    handleRetry,
    scanFromImage
  };
};
