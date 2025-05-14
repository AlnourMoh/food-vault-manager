
import React from 'react';
import { ScannerFrame as MobileScannerFrame } from '@/components/mobile/scanner/components/ScannerFrame';

// This is a wrapper component that uses the mobile scanner frame
const ScannerFrame: React.FC<{
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
}> = (props) => {
  return <MobileScannerFrame {...props} />;
};

export default ScannerFrame;
