
import React from 'react';
import { useZXingBarcodeScanner } from '@/hooks/scanner/useZXingBarcodeScanner';
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
    hasScannerError: scannerError,
    requestPermission,
    handleRetry
  } = useZXingBarcodeScanner({ onScan, onClose, autoStart });

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
    return <ScannerErrorView errorMessage={"حدث خطأ في الماسح الضوئي"} onRetry={handleRetry} onClose={onClose} />;
  }
  
  // عرض الكاميرا النشطة
  return <ActiveScannerView cameraActive={cameraActive} onClose={onClose} />;
};

export default ZXingBarcodeScanner;
