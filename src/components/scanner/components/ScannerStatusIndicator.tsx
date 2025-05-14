
import React from 'react';
import { ScannerStatusIndicator as MobileScannerStatusIndicator } from '@/components/mobile/scanner/components/ScannerStatusIndicator';

// This is a wrapper component that uses the mobile scanner status indicator
const ScannerStatusIndicator: React.FC<{
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
}> = (props) => {
  return <MobileScannerStatusIndicator {...props} />;
};

export default ScannerStatusIndicator;
