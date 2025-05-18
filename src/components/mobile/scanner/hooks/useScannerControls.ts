
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePermissionStatus } from '@/hooks/camera/usePermissionStatus';
import { usePermissionRequest } from '@/hooks/camera/usePermissionRequest';
import { useAppSettings } from '@/hooks/camera/useAppSettings';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { useScannerEnvironment } from '@/hooks/useScannerEnvironment';
import '@/types/barcode-scanner-augmentation.d.ts';

interface UseScannerControlsProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useScannerControls = ({ onScan, onClose }: UseScannerControlsProps) => {
  // استخدام hook لتتبع حالة الماسح
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const { toast } = useToast();
  
  // استخدام hooks للتحكم بأذونات الكاميرا
  const permissionStatus = usePermissionStatus();
  const { isLoading, hasPermission, checkPermission } = permissionStatus;
  const { requestCameraPermission } = usePermissionRequest(permissionStatus);
  const { openAppSettings } = useAppSettings();
  const environment = useScannerEnvironment();

  // فحص الأذونات عند تحميل المكون
  useEffect(() => {
    const initialCheck = async () => {
      await checkPermission();
    };
    initialCheck();
  }, []);

  // تسجيل تشخيصي للبيئة
  useEffect(() => {
    console.log('Scanner Controls - Environment:', environment);
    console.log('Scanner Controls - Permission Status:', { isLoading, hasPermission });
  }, [environment, isLoading, hasPermission]);

  // بدء المسح
  const startScan = async (): Promise<boolean> => {
    try {
      setHasScannerError(false);
      setIsScanningActive(true);
      console.log('Attempting to start scan...');
      
      // التحقق من دعم الماسح
      if (!environment.isNativePlatform && !environment.isWebView) {
        console.log('Not in native environment or WebView');
        setHasScannerError(true);
        setIsScanningActive(false);
        toast({
          title: "غير مدعوم",
          description: "المسح غير مدعوم في بيئة المتصفح. يرجى استخدام تطبيق الجوال.",
          variant: "destructive"
        });
        return false;
      }
      
      // التحقق من توفر الملحقات المطلوبة
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('MLKit Barcode Scanner not available');
        setHasScannerError(true);
        setIsScanningActive(false);
        toast({
          title: "غير مدعوم",
          description: "ملحق المسح غير متاح على هذا الجهاز",
          variant: "destructive"
        });
        return false;
      }
      
      // التحقق من الأذونات وطلبها إذا لزم الأمر
      if (!hasPermission) {
        console.log('No camera permission, requesting...');
        const granted = await requestCameraPermission();
        if (!granted) {
          console.log('Permission denied');
          setHasScannerError(true);
          setIsScanningActive(false);
          return false;
        }
      }
      
      try {
        console.log('Starting scan...');
        const result = await BarcodeScanner.scan();
        
        console.log('Scan result:', result);
        setIsScanningActive(false);
        
        if (result.barcodes && result.barcodes.length > 0) {
          const code = result.barcodes[0].rawValue;
          if (code) {
            setLastScannedCode(code);
            onScan(code);
            return true;
          }
        }
        
        return false;
      } catch (error) {
        console.error('Error during scan:', error);
        setHasScannerError(true);
        setIsScanningActive(false);
        return false;
      }
    } catch (error) {
      console.error('Error in startScan:', error);
      setHasScannerError(true);
      setIsScanningActive(false);
      return false;
    }
  };

  // إيقاف المسح
  const stopScan = async (): Promise<boolean> => {
    try {
      setIsScanningActive(false);
      
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          await BarcodeScanner.enableTorch(false).catch(() => {});
          
          // Fixed: call stopScan without arguments
          await BarcodeScanner.stopScan();
        } catch (error) {
          console.error('Error stopping scan:', error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('[useScannerControls] خطأ في إيقاف المسح:', error);
      return false;
    }
  };

  // التعامل مع الإدخال اليدوي
  const handleManualEntry = () => {
    setIsManualEntry(true);
  };

  const handleManualCancel = () => {
    setIsManualEntry(false);
  };

  const handleRetry = () => {
    setHasScannerError(false);
    startScan();
  };

  return {
    isManualEntry,
    hasScannerError,
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan,
    handleManualEntry,
    handleManualCancel,
    requestPermission: requestCameraPermission,
    handleRetry,
    cameraActive,
    setCameraActive
  };
};
