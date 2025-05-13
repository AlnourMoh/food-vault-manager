
import React, { useEffect } from 'react';
import { useZXingBarcodeScanner } from '@/hooks/scanner/useZXingBarcodeScanner';
import { BrowserView } from './scanner/components/BrowserView';
import { PermissionView } from './scanner/components/PermissionView';
import { LoadingView } from './scanner/components/LoadingView';
import { ScannerView } from './scanner/components/ScannerView';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
  onManualEntry?: () => void;
}

const ZXingBarcodeScanner = ({ onScan, onClose, autoStart = true, onManualEntry }: ZXingBarcodeScannerProps) => {
  const {
    isNativePlatform,
    hasPermission,
    scanActive,
    cameraActive,
    isLoading,
    startScan,
    stopScan,
    checkAndRequestPermissions
  } = useZXingBarcodeScanner(autoStart, onScan, onClose);
  
  // إذا كنا في بيئة المتصفح، نظهر رسالة بدلاً من الماسح
  if (!isNativePlatform) {
    return <BrowserView onClose={onClose} />;
  }
  
  // إذا لم يكن لدينا إذن الكاميرا
  if (hasPermission === false) {
    return (
      <PermissionView 
        handleRequestPermission={async () => {
          await checkAndRequestPermissions();
        }} 
        onClose={onClose}
        onManualEntry={onManualEntry}
      />
    );
  }
  
  // أثناء التحقق من الإذن أو عملية المسح النشطة
  if (isLoading || hasPermission === null) {
    return <LoadingView hasPermission={hasPermission} scanActive={scanActive} onClose={onClose} />;
  }
  
  // واجهة المستخدم الرئيسية للماسح
  return (
    <ScannerView 
      isActive={scanActive}
      cameraActive={cameraActive || false}
      hasError={false}
      onStartScan={startScan}
      onStopScan={stopScan}
      onRetry={() => startScan()}
      onClose={onClose}
    />
  );
};

export default ZXingBarcodeScanner;
