
import React, { useEffect, useState } from 'react';
import { useScannerControls } from './scanner/hooks/useScannerControls';
import { ScannerContainer } from './scanner/ScannerContainer';
import { MockScanner } from './scanner/MockScanner';
import { Capacitor } from '@capacitor/core';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ 
  onScan, 
  onClose,
  autoStart = true // Always auto-start by default
}) => {
  const {
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
    requestPermission,
    handleRetry,
    cameraActive,
    setCameraActive
  } = useScannerControls({ onScan, onClose });

  const [useWebMock, setUseWebMock] = useState(false);

  // التحقق مما إذا كنا في بيئة الويب
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      // في بيئة الويب، نستخدم المحاكاة
      setUseWebMock(true);
    }
  }, []);

  // تفعيل الكاميرا فوراً عند تحميل المكون
  useEffect(() => {
    console.log('ZXingBarcodeScanner: تفعيل الكاميرا فورًا عند تحميل المكون');
    
    if (!useWebMock) {
      // تفعيل الكاميرا
      setCameraActive(true);
      
      // بدء المسح فوراً
      const timerRef = setTimeout(() => {
        startScan().catch(error => {
          console.error('ZXingBarcodeScanner: خطأ في بدء المسح المباشر:', error);
        });
      }, 500);
      
      return () => {
        clearTimeout(timerRef);
        stopScan().catch(error => {
          console.error('ZXingBarcodeScanner: خطأ في إيقاف المسح عند التنظيف:', error);
        });
      };
    }
  }, [useWebMock]);

  // استخدام محاكاة الماسح في بيئة الويب
  if (useWebMock) {
    return <MockScanner onScan={onScan} onClose={onClose} />;
  }

  // استخدام الماسح الحقيقي في بيئة الأجهزة الجوالة
  return (
    <ScannerContainer
      isManualEntry={isManualEntry}
      hasScannerError={hasScannerError}
      isLoading={isLoading}
      hasPermission={hasPermission}
      isScanningActive={isScanningActive}
      lastScannedCode={lastScannedCode}
      onScan={onScan}
      onClose={onClose}
      startScan={startScan}
      stopScan={stopScan}
      handleManualEntry={handleManualEntry}
      handleManualCancel={handleManualCancel}
      handleRequestPermission={requestPermission}
      handleRetry={handleRetry}
      cameraActive={cameraActive}
    />
  );
};

export default ZXingBarcodeScanner;
