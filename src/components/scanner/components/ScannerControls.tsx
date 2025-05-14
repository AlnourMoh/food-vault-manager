
import React from 'react';
import { ScannerControls as MobileScannerControls } from '@/components/mobile/scanner/components/ScannerControls';

// This is a wrapper component that uses the mobile scanner controls
const ScannerControls: React.FC<{
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
  onStartScan: () => Promise<boolean>;
  onStopScan: () => Promise<boolean>;
  onRetry: () => void;
  onClose: () => void;
  onToggleFlash?: () => void;
}> = (props) => {
  return <MobileScannerControls {...props} />;
};

export default ScannerControls;
