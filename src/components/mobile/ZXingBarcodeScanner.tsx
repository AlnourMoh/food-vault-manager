
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
  autoStart = true // تعيين القيمة الافتراضية إلى true للبدء التلقائي
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

  const [isInitialized, setIsInitialized] = useState(false);

  // تفعيل المسح تلقائيًا عند تحميل المكون
  useEffect(() => {
    if (!isInitialized && !isLoading && hasPermission !== false) {
      console.log('ZXingBarcodeScanner: تهيئة المسح التلقائي');
      setIsInitialized(true);
      
      // تحديد الكاميرا كنشطة بمجرد تحميل المكون
      setCameraActive(true);
      
      // لا نحتاج إلى تأخير هنا، سيتم تفعيل المسح تلقائياً من ScannerView
    }
  }, [isInitialized, isLoading, hasPermission, setCameraActive]);

  // تأكيد الاستجابة السريعة للتغييرات في حالة الكاميرا
  useEffect(() => {
    if (cameraActive && !isScanningActive && !hasScannerError && !isManualEntry) {
      console.log('ZXingBarcodeScanner: الكاميرا نشطة الآن، جاري تفعيل المسح');
      startScan().catch(error => {
        console.error('ZXingBarcodeScanner: خطأ عند بدء المسح تلقائياً بعد تنشيط الكاميرا:', error);
      });
    }
  }, [cameraActive, isScanningActive, hasScannerError, isManualEntry, startScan]);

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
