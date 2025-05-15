
import React, { useEffect, useState } from 'react';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { ZXingScannerContent } from './scanner/ZXingScannerContent';
import { scannerOperationsService } from '@/services/scanner/ScannerOperationsService';
import { Capacitor } from '@capacitor/core';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({
  onScan,
  onClose,
  autoStart = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  
  const { hasPermission, requestPermission, openAppSettings } = useCameraPermissions();
  
  // تشغيل المسح تلقائيًا عند تحميل المكون إذا كان autoStart = true
  useEffect(() => {
    console.log('[ZXingBarcodeScanner] تحميل المكون، autoStart =', autoStart);
    
    const initializeScanner = async () => {
      try {
        setIsLoading(true);
        
        // التحقق من توفر المنصة الأصلية والملحق
        const isNative = Capacitor.isNativePlatform();
        const hasPlugin = Capacitor.isPluginAvailable('MLKitBarcodeScanner');
        
        console.log('[ZXingBarcodeScanner] بيئة أصلية:', isNative, 'ملحق المسح متوفر:', hasPlugin);
        
        if (!isNative || !hasPlugin) {
          console.warn('[ZXingBarcodeScanner] تشغيل في بيئة غير مدعومة');
          setHasScannerError(true);
          setIsLoading(false);
          return;
        }
        
        // تنشيط الكاميرا
        setCameraActive(true);
        
        // إذا كان autoStart = true، قم بتشغيل المسح تلقائيًا
        if (autoStart && hasPermission) {
          startScan();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('[ZXingBarcodeScanner] خطأ في تهيئة الماسح:', error);
        setHasScannerError(true);
        setIsLoading(false);
      }
    };
    
    initializeScanner();
    
    // تنظيف عند إلغاء تحميل المكون
    return () => {
      stopScan().catch(error => {
        console.error('[ZXingBarcodeScanner] خطأ في تنظيف الماسح:', error);
      });
    };
  }, [autoStart, hasPermission]);
  
  const startScan = async (): Promise<boolean> => {
    try {
      console.log('[ZXingBarcodeScanner] بدء المسح...');
      setIsScanningActive(true);
      setHasScannerError(false);
      
      // استخدام خدمة المسح
      const result = await scannerOperationsService.startScan();
      
      // معالجة نتيجة المسح
      if (result.success && result.data) {
        setLastScannedCode(result.data);
        onScan(result.data);
      } else {
        console.warn('[ZXingBarcodeScanner] فشل في المسح:', result.error);
        setHasScannerError(true);
      }
      
      setIsScanningActive(false);
      return true;
    } catch (error) {
      console.error('[ZXingBarcodeScanner] خطأ في بدء المسح:', error);
      setHasScannerError(true);
      setIsScanningActive(false);
      return false;
    }
  };
  
  const stopScan = async (): Promise<boolean> => {
    try {
      console.log('[ZXingBarcodeScanner] إيقاف المسح...');
      setIsScanningActive(false);
      
      // استخدام خدمة المسح لإيقاف المسح
      await scannerOperationsService.stopScan();
      
      setCameraActive(false);
      return true;
    } catch (error) {
      console.error('[ZXingBarcodeScanner] خطأ في إيقاف المسح:', error);
      return false;
    }
  };
  
  const handleRetry = async () => {
    setHasScannerError(false);
    startScan();
  };
  
  const handleManualEntry = () => {
    console.log('[ZXingBarcodeScanner] الانتقال إلى الإدخال اليدوي');
    // يمكن تنفيذ وظيفة الإدخال اليدوي هنا
  };
  
  return (
    <ZXingScannerContent
      isLoading={isLoading}
      hasPermission={hasPermission}
      isScanningActive={isScanningActive}
      hasScannerError={hasScannerError}
      cameraActive={cameraActive}
      onScan={onScan}
      onClose={onClose}
      startScan={startScan}
      stopScan={stopScan}
      requestPermission={requestPermission}
      handleRetry={handleRetry}
      onManualEntry={handleManualEntry}
    />
  );
};

export default ZXingBarcodeScanner;
