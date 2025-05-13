
import { useState, useCallback } from 'react';
import { zxingService } from '@/services/scanner/ZXingService';
import { useToast } from '@/hooks/use-toast';
import { ZXingScanResult } from '@/types/zxing-scanner';

/**
 * هوك للتعامل مع عمليات المسح
 */
export const useScannerOperations = (
  onScan?: (code: string) => void
) => {
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [hasScannerError, setHasScannerError] = useState(false);
  const { toast } = useToast();

  /**
   * معالجة نتيجة المسح
   */
  const handleScanResult = useCallback((result: ZXingScanResult) => {
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
  const startScan = useCallback(async (hasPermission: boolean, requestPermission: () => Promise<boolean>): Promise<boolean> => {
    try {
      if (isScanningActive) {
        console.log('[useScannerOperations] الماسح نشط بالفعل');
        return true;
      }
      
      setHasScannerError(false);
      
      // التحقق من الإذن وطلبه إذا لزم الأمر
      if (hasPermission !== true) {
        const granted = await requestPermission();
        if (!granted) {
          return false;
        }
      }
      
      setIsScanningActive(true);
      
      // بدء المسح
      const success = await zxingService.startScan({
        tryHarder: true,
        delayBetweenScanAttempts: 500
      }, handleScanResult);
      
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
      console.error('[useScannerOperations] خطأ في بدء المسح:', error);
      
      setHasScannerError(true);
      setIsScanningActive(false);
      
      toast({
        title: "خطأ في الماسح الضوئي",
        description: "حدث خطأ غير متوقع أثناء بدء المسح",
        variant: "destructive"
      });
      
      return false;
    }
  }, [isScanningActive, handleScanResult, toast]);

  /**
   * إيقاف المسح
   */
  const stopScan = useCallback(async (): Promise<void> => {
    try {
      if (!isScanningActive) {
        return;
      }
      
      await zxingService.stopScan();
      
      setIsScanningActive(false);
    } catch (error) {
      console.error('[useScannerOperations] خطأ في إيقاف المسح:', error);
      setIsScanningActive(false);
    }
  }, [isScanningActive]);

  /**
   * مسح من صورة
   */
  const scanFromImage = useCallback(async (imageSource: string | Blob | File): Promise<string | null> => {
    try {
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
      console.error('[useScannerOperations] خطأ في مسح الصورة:', error);
      return null;
    }
  }, [onScan]);

  return {
    isScanningActive,
    setIsScanningActive,
    lastScannedCode,
    setLastScannedCode,
    hasScannerError,
    setHasScannerError,
    startScan,
    stopScan,
    scanFromImage
  };
};
