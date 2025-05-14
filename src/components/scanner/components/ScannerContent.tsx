
import React from 'react';
import ScannerLoadingView from './ScannerLoadingView';
import ScannerErrorView from './ScannerErrorView';
import ScannerStartView from './ScannerStartView';
import ActiveScannerView from './ActiveScannerView';

interface ScannerContentProps {
  isLoading: boolean;
  hasError: boolean;
  isScanning: boolean;
  onStartScan: () => void;
  onRetry: () => void;
  onClose: () => void;
}

const ScannerContent: React.FC<ScannerContentProps> = ({
  isLoading,
  hasError,
  isScanning,
  onStartScan,
  onRetry,
  onClose
}) => {
  if (isLoading) {
    return <ScannerLoadingView />;
  }
  
  if (hasError) {
    return <ScannerErrorView onRetry={onRetry} onClose={onClose} />;
  }
  
  if (!isScanning) {
    return <ScannerStartView onStartScan={onStartScan} />;
  }
  
  return <ActiveScannerView />;
};

export default ScannerContent;
