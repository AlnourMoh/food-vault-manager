
import React, { useEffect } from 'react';
import { ZXingScannerContent } from './scanner/ZXingScannerContent';
import { useScannerPermissions } from '@/hooks/scanner/hooks/useScannerPermissions';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { scannerCameraService } from '@/services/scanner/ScannerCameraService';
import { WebScanner } from './scanner/WebScanner';

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
  // استدعاء خطاف أذونات الماسح
  const { isLoading, hasPermission, requestPermission, setHasPermission } = useScannerPermissions();
  const [isScanningActive, setIsScanningActive] = React.useState(false);
  const [hasScannerError, setHasScannerError] = React.useState(false);
  const [cameraActive, setCameraActive] = React.useState(false);
  const [useWebScanner, setUseWebScanner] = React.useState(false);

  // تحديد ما إذا كنا سنستخدم الماسح المحلي أو ماسح الويب
  useEffect(() => {
    // استخدام ماسح الويب في بيئة المتصفح أو عندما لا تتوفر ملحقات الماسح المحلي
    const shouldUseWebScanner = !Capacitor.isNativePlatform() || 
                               !Capacitor.isPluginAvailable('MLKitBarcodeScanner') ||
                               scannerCameraService.isMockMode();
    console.log(`[ZXingBarcodeScanner] استخدام ماسح الويب: ${shouldUseWebScanner}`);
    setUseWebScanner(shouldUseWebScanner);
  }, []);

  // تفعيل الماسح تلقائياً إذا كانت الخاصية autoStart مضبوطة على true
  useEffect(() => {
    if (autoStart && hasPermission && !isLoading) {
      console.log('[ZXingBarcodeScanner] تفعيل الماسح تلقائياً');
      startScan();
    }
  }, [autoStart, hasPermission, isLoading]);

  // بدء المسح الضوئي
  const startScan = async () => {
    try {
      console.log('[ZXingBarcodeScanner] بدء المسح...');
      
      if (useWebScanner) {
        console.log('[ZXingBarcodeScanner] استخدام ماسح الويب');
        setIsScanningActive(true);
        setCameraActive(true);
        return true;
      }
      
      // تحضير الكاميرا
      const prepared = await scannerCameraService.prepareCamera();
      if (!prepared) {
        console.error('[ZXingBarcodeScanner] فشل في تحضير الكاميرا');
        setHasScannerError(true);
        
        // عرض رسالة خطأ
        await Toast.show({
          text: 'فشل في تفعيل الكاميرا. يرجى التحقق من الأذونات وإعادة المحاولة.',
          duration: 'long'
        });
        
        return false;
      }
      
      setCameraActive(true);
      setIsScanningActive(true);
      
      // تسجيل أن الماسح نشط الآن
      console.log('[ZXingBarcodeScanner] الماسح نشط الآن');
      return true;
    } catch (error) {
      console.error('[ZXingBarcodeScanner] خطأ في بدء المسح:', error);
      setHasScannerError(true);
      return false;
    }
  };

  // إيقاف المسح الضوئي
  const stopScan = async () => {
    try {
      console.log('[ZXingBarcodeScanner] إيقاف المسح...');
      setIsScanningActive(false);
      
      if (useWebScanner) {
        console.log('[ZXingBarcodeScanner] إيقاف ماسح الويب');
        setCameraActive(false);
        return true;
      }
      
      // تنظيف موارد الكاميرا
      await scannerCameraService.cleanupCamera();
      setCameraActive(false);
      
      return true;
    } catch (error) {
      console.error('[ZXingBarcodeScanner] خطأ في إيقاف المسح:', error);
      return false;
    }
  };

  // إعادة المحاولة في حال حدوث خطأ
  const handleRetry = async () => {
    console.log('[ZXingBarcodeScanner] إعادة المحاولة بعد الخطأ');
    setHasScannerError(false);
    
    // إعادة تعيين الكاميرا بالكامل
    const reset = await scannerCameraService.resetCamera();
    if (reset) {
      // محاولة بدء المسح مرة أخرى
      await startScan();
    } else {
      console.error('[ZXingBarcodeScanner] فشلت إعادة تعيين الكاميرا');
      setHasScannerError(true);
    }
  };

  // استخدام ماسح الويب إذا كنا في بيئة الويب
  if (useWebScanner) {
    return <WebScanner onScan={onScan} onClose={onClose} />;
  }

  // استخدام الماسح الأصلي في الأجهزة الجوالة
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
    />
  );
};

export default ZXingBarcodeScanner;
