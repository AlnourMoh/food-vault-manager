
import React from 'react';
import { useZXingBarcodeScanner } from '@/hooks/scanner/useZXingBarcodeScanner';
import { BrowserView } from './scanner/components/BrowserView';
import { PermissionView } from './scanner/components/PermissionView';
import { LoadingView } from './scanner/components/LoadingView';
import { ScannerView } from './scanner/components/ScannerView';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner = ({ onScan, onClose, autoStart = true }: ZXingBarcodeScannerProps) => {
  const {
    isNativePlatform,
    hasPermission,
    scanActive,
    startScan,
    checkAndRequestPermissions
  } = useZXingBarcodeScanner(autoStart, onScan, onClose);
  
  // إذا كنا في بيئة المتصفح، نظهر رسالة بدلاً من الماسح
  if (!isNativePlatform) {
    return <BrowserView onClose={onClose} />;
  }
  
  // إذا لم يكن لدينا إذن الكاميرا
  if (hasPermission === false) {
    return <PermissionView onRequestPermission={checkAndRequestPermissions} onClose={onClose} />;
  }
  
  // أثناء التحقق من الإذن أو عملية المسح النشطة
  if (hasPermission === null || scanActive) {
    return <LoadingView hasPermission={hasPermission} scanActive={scanActive} onClose={onClose} />;
  }
  
  // واجهة المستخدم الرئيسية للماسح
  return <ScannerView onStartScan={async () => { await startScan(); return true; }} onClose={onClose} />;
};

export default ZXingBarcodeScanner;
