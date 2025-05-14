
import React from 'react';
import { Capacitor } from '@capacitor/core';

import { useScannerState } from './hooks/useScannerState';
import { useScannerActions } from './hooks/useScannerActions';
import BrowserView from './components/BrowserView';
import ScannerLayout from './components/ScannerLayout';

interface SimpleBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const SimpleBarcodeScanner: React.FC<SimpleBarcodeScannerProps> = ({ 
  onScan, 
  onClose, 
  autoStart = false 
}) => {
  const scannerState = useScannerState(autoStart);
  const { startScan, stopScan } = useScannerActions({ 
    onScan, 
    onClose, 
    autoStart, 
    scannerState 
  });

  // في بيئة المتصفح، نعرض رسالة بدلاً من الماسح
  if (!Capacitor.isNativePlatform()) {
    return <BrowserView onClose={onClose} />;
  }

  return (
    <ScannerLayout 
      scannerState={scannerState}
      startScan={startScan}
      stopScan={stopScan}
      onClose={onClose}
    />
  );
};

export default SimpleBarcodeScanner;
