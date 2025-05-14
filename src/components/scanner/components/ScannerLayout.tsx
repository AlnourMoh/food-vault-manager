
import React from 'react';
import ScannerHeader from './ScannerHeader';
import ScannerContent from './ScannerContent';
import ScannerFooter from './ScannerFooter';

interface ScannerLayoutProps {
  scannerState: ReturnType<typeof import('../hooks/useScannerState').useScannerState>;
  startScan: () => Promise<void>;
  stopScan: () => Promise<void>;
  onClose: () => void;
}

const ScannerLayout: React.FC<ScannerLayoutProps> = ({
  scannerState,
  startScan,
  stopScan,
  onClose
}) => {
  const { isLoading, hasError, isScanning } = scannerState;
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* شريط العنوان */}
      <ScannerHeader onClose={onClose} />
      
      {/* منطقة المسح */}
      <div className="flex-1 flex items-center justify-center">
        <ScannerContent
          isLoading={isLoading}
          hasError={hasError}
          isScanning={isScanning}
          onStartScan={startScan}
          onRetry={startScan}
          onClose={onClose}
        />
      </div>
      
      {/* شريط الأدوات السفلي */}
      <ScannerFooter 
        isScanning={isScanning} 
        onStopScan={stopScan} 
      />
    </div>
  );
};

export default ScannerLayout;
