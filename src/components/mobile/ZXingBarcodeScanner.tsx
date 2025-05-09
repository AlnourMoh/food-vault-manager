
import React from 'react';
import { useZXingBarcodeScannerHook } from '@/hooks/scanner/useZXingBarcodeScannerHook';
import { ScannerLoadingView } from './scanner/components/ScannerLoadingView';
import { PermissionRequestView } from './scanner/components/PermissionRequestView';
import { ScannerErrorView } from './scanner/components/ScannerErrorView';
import { ActiveScannerView } from './scanner/components/ActiveScannerView';

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
  const {
    isLoading,
    hasPermission,
    cameraActive,
    scannerError,
    requestPermission,
    handleRetry
  } = useZXingBarcodeScannerHook({ onScan, onClose, autoStart });

  // عرض شاشة التحميل
  if (isLoading) {
    return <ScannerLoadingView onClose={onClose} />;
  }
  
  // عرض شاشة طلب الإذن
  if (hasPermission === false) {
    return <PermissionRequestView onRequestPermission={requestPermission} onClose={onClose} />;
  }
  
  // عرض شاشة الخطأ
  if (scannerError) {
    return <ScannerErrorView errorMessage={scannerError} onRetry={handleRetry} onClose={onClose} />;
  }
  
  // عرض الكاميرا النشطة
  return <ActiveScannerView cameraActive={cameraActive} onClose={onClose} />;
};

export default ZXingBarcodeScanner;
