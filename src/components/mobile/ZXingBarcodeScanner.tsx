
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

  // Activate camera immediately when component mounts
  useEffect(() => {
    console.log('ZXingBarcodeScanner: تفعيل الكاميرا فورًا عند تحميل المكون');
    
    // Set camera as active immediately
    setCameraActive(true);
    
    // Start scan immediately without waiting
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
  }, []);

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
