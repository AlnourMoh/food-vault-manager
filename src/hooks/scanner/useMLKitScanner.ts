
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { useScannerUI } from './useScannerUI';

interface UseMLKitScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useMLKitScanner = ({ onScan, onClose }: UseMLKitScannerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  
  const { toast } = useToast();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();
  
  // التحقق من الأذونات
  const checkPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        setHasPermission(false);
        return false;
      }
      
      const result = await BarcodeScanner.checkPermissions();
      const granted = result.camera === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('خطأ عند التحقق من الأذونات:', error);
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // طلب الأذونات
  const requestPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await BarcodeScanner.requestPermissions();
      const granted = result.camera === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('خطأ عند طلب الأذونات:', error);
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // فحص الأذونات عند تحميل المكون
  useEffect(() => {
    checkPermission().catch(console.error);
    
    // التنظيف عند إلغاء تحميل المكون
    return () => {
      stopScan().catch(console.error);
    };
  }, []);
  
  // بدء المسح
  const startScan = useCallback(async () => {
    try {
      // التحقق أولاً من وجود الإذن
      if (hasPermission !== true) {
        const granted = await requestPermission();
        if (!granted) {
          return false;
        }
      }
      
      setIsScanningActive(true);
      setHasScannerError(false);
      
      // إعداد الكاميرا والخلفية
      await setupScannerBackground();
      
      // ضمان توافق الجهاز
      const isSupported = await BarcodeScanner.isSupported();
      if (!isSupported.supported) {
        setHasScannerError(true);
        toast({
          title: "الماسح غير مدعوم",
          description: "هذا الجهاز لا يدعم ماسح الباركود.",
          variant: "destructive"
        });
        setIsScanningActive(false);
        return false;
      }
      
      // مسح الباركود
      try {
        const result = await BarcodeScanner.scan({
          formats: [
            BarcodeFormat.QrCode,
            BarcodeFormat.Ean13,
            BarcodeFormat.Code128
          ]
        });
        
        if (result.barcodes && result.barcodes.length > 0) {
          const code = result.barcodes[0].rawValue || '';
          setLastScannedCode(code);
          onScan(code);
        }
        
        return true;
      } catch (error) {
        console.error('خطأ في عملية المسح:', error);
        setHasScannerError(true);
        return false;
      } finally {
        await stopScan();
      }
    } catch (error) {
      console.error('خطأ عام في بدء المسح:', error);
      setHasScannerError(true);
      setIsScanningActive(false);
      return false;
    }
  }, [hasPermission, requestPermission, onScan]);
  
  // إيقاف المسح
  const stopScan = useCallback(async () => {
    try {
      setIsScanningActive(false);
      await cleanupScannerBackground();
      
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        await BarcodeScanner.stopScan().catch(() => {});
      }
      
      return true;
    } catch (error) {
      console.error('خطأ في إيقاف المسح:', error);
      return false;
    }
  }, []);
  
  // الإدخال اليدوي
  const handleManualEntry = useCallback(() => {
    setIsManualEntry(true);
  }, []);
  
  const handleManualCancel = useCallback(() => {
    setIsManualEntry(false);
  }, []);
  
  // إعادة المحاولة بعد الخطأ
  const handleRetry = useCallback(() => {
    setHasScannerError(false);
    startScan().catch(console.error);
  }, [startScan]);
  
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
    handleRetry
  };
};
