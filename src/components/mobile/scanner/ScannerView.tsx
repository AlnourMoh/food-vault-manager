
import React from 'react';
import { ScannerControls } from './components/ScannerControls';
import { ScannerFrame } from './components/ScannerFrame';
import { ScannerStatusIndicator } from './components/ScannerStatusIndicator';
import styles from './scanner.module.css';

export interface ScannerViewProps {
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
  onStartScan: () => Promise<boolean>;
  onStopScan: () => Promise<boolean>;
  onRetry: () => void;
  onClose: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  isActive,
  cameraActive,
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
        {/* حالة الكاميرا والماسح والأيقونة */}
        <ScannerStatusIndicator 
          isActive={isActive} 
          cameraActive={cameraActive}
          hasError={hasError} 
        />
        
        {/* إطار المسح */}
        <ScannerFrame 
          isActive={isActive} 
          cameraActive={cameraActive}
          hasError={hasError} 
        />

        {cameraActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center p-2 rounded-md bg-black/50">
              {isActive ? 'الكاميرا نشطة - وجه إلى الباركود' : 'الكاميرا جاهزة'}
            </div>
          </div>
        )}
      </div>
      
      {/* أزرار التحكم */}
      <ScannerControls 
        isActive={isActive}
        cameraActive={cameraActive}
        hasError={hasError}
        onStartScan={onStartScan}
        onStopScan={onStopScan}
        onClose={onClose}
        onRetry={onRetry}
      />
    </div>
  );
};
