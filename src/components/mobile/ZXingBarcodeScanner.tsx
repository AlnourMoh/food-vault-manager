
import React, { useEffect } from 'react';
import { useZXingBarcodeScanner } from '@/hooks/scanner/useZXingBarcodeScanner';
import { ZXingScannerContent } from './scanner/ZXingScannerContent';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ 
  onScan, 
  onClose, 
  autoStart = true 
}) => {
  console.log('ZXingBarcodeScanner: تهيئة الماسح');

  const {
    isLoading,
    hasPermission,
    isScanningActive,
    cameraActive,
    hasScannerError,
    startScan,
    stopScan,
    activateCamera,
    requestPermission,
    handleRetry
  } = useZXingBarcodeScanner({
    onScan,
    onClose,
    autoStart
  });
  
  useEffect(() => {
    console.log('ZXingBarcodeScanner: حالات الماسح الضوئي:', { 
      isLoading, 
      hasPermission, 
      isScanningActive, 
      cameraActive, 
      hasScannerError 
    });
    
    // تسجيل عند تحميل المكون
    console.log('ZXingBarcodeScanner: تم تحميل المكون');
    
    return () => {
      console.log('ZXingBarcodeScanner: تم إزالة المكون');
    };
  }, [isLoading, hasPermission, isScanningActive, cameraActive, hasScannerError]);

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
