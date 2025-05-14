
import React from 'react';
import ScannerLoadingView from './ScannerLoadingView';
import ScannerErrorView from './ScannerErrorView';
import ScannerActiveView from './ScannerActiveView';

interface ScannerContentProps {
  isLoading: boolean;
  hasError: boolean;
  isScanning: boolean;
  onStartScan: () => Promise<void>;
  onRetry: () => Promise<void>;
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
  // تحسين التعامل مع حالات العرض المختلفة
  if (isLoading) {
    return <ScannerLoadingView onClose={onClose} />;
  }

  if (hasError) {
    return <ScannerErrorView onRetry={onRetry} onClose={onClose} />;
  }

  return (
    <ScannerActiveView 
      isActive={isScanning} 
      onStartScan={onStartScan} 
      onClose={onClose} 
    />
  );
};

export default ScannerContent;
