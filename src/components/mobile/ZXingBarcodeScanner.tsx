
import React, { useEffect, useState } from 'react';
import { useScannerControls } from './scanner/hooks/useScannerControls';
import { ScannerContainer } from './scanner/ScannerContainer';

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
    cameraActive
  } = useScannerControls({ onScan, onClose });

  const [isInitialized, setIsInitialized] = useState(false);

  // تفعيل المسح تلقائيًا عند تحميل المكون إذا كانت خاصية autoStart = true
  useEffect(() => {
    if (autoStart && !isInitialized && !isLoading && hasPermission !== false) {
      console.log('ZXingBarcodeScanner: بدء المسح تلقائياً');
      setIsInitialized(true);
      
      // تأخير قصير جدًا للسماح بتحميل واجهة المستخدم
      const timer = setTimeout(() => {
        startScan().catch(console.error);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [autoStart, isInitialized, isLoading, hasPermission]);

  // إضافة تفعيل المسح عندما تصبح الكاميرا نشطة
  useEffect(() => {
    if (cameraActive && !isScanningActive && !hasScannerError && !isManualEntry) {
      console.log('ZXingBarcodeScanner: الكاميرا نشطة الآن، جاري تفعيل المسح');
      startScan().catch(error => {
        console.error('ZXingBarcodeScanner: خطأ عند بدء المسح تلقائياً بعد تنشيط الكاميرا:', error);
      });
    }
  }, [cameraActive, isScanningActive, hasScannerError, isManualEntry]);

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
