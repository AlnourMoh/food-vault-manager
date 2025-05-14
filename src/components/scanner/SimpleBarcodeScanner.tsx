
import React from 'react';
import { Capacitor } from '@capacitor/core';

import { useScannerState } from './hooks/useScannerState';
import { useScannerActions } from './hooks/useScannerActions';
import BrowserView from './components/BrowserView';
import ScannerHeader from './components/ScannerHeader';
import ScannerContent from './components/ScannerContent';
import ScannerFooter from './components/ScannerFooter';

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
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* شريط العنوان */}
      <ScannerHeader onClose={onClose} />
      
      {/* منطقة المسح */}
      <div className="flex-1 flex items-center justify-center">
        <ScannerContent
          isLoading={scannerState.isLoading}
          hasError={scannerState.hasError}
          isScanning={scannerState.isScanning}
          onStartScan={startScan}
          onRetry={startScan}
          onClose={onClose}
        />
      </div>
      
      {/* شريط الأدوات السفلي */}
      <ScannerFooter 
        isScanning={scannerState.isScanning} 
        onStopScan={stopScan} 
      />
    </div>
  );
};

export default SimpleBarcodeScanner;
