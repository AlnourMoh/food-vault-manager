import React from 'react';
import { ScannerControls } from './components/ScannerControls';
import { ScannerFrame } from './components/ScannerFrame';
import { ScannerStatusIndicator } from './components/ScannerStatusIndicator';
import styles from './scanner.module.css';

export interface ScannerViewProps {
  isActive: boolean;
  hasError: boolean;
  onStartScan: () => Promise<boolean>;
  onStopScan: () => Promise<boolean>;
  onRetry: () => void;
  onClose: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  isActive,
  hasError,
  onStartScan,
  onStopScan,
  onRetry,
  onClose
}) => {
  // Start scan immediately when this component mounts if it's not active already
  React.useEffect(() => {
    if (!isActive && !hasError) {
      console.log('[ScannerView] Auto-starting scan on mount');
      onStartScan().catch(error => {
        console.error('[ScannerView] Error auto-starting scan:', error);
      });
    }
  }, []);

  return (
    <div className="scanner-container fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        {/* حالة الماسح والأيقونة */}
        <ScannerStatusIndicator isActive={isActive} hasError={hasError} />
        
        {/* إطار المسح */}
        <ScannerFrame isActive={isActive} hasError={hasError} />
      </div>
      
      {/* أزرار التحكم */}
      <ScannerControls 
        isActive={isActive}
        hasError={hasError}
        onStartScan={onStartScan}
        onStopScan={onStopScan}
        onClose={onClose}
        onRetry={onRetry}
      />
    </div>
  );
};
