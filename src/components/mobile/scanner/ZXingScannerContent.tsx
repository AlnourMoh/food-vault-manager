
import React from 'react';
import { ScannerView } from './ScannerView';
import { NoPermissionView } from './NoPermissionView';
import { ScannerLoading } from './ScannerLoading';

interface ZXingScannerContentProps {
  isLoading: boolean;
  hasPermission: boolean | null;
  isScanningActive: boolean;
  hasScannerError: boolean;
  onScan: (code: string) => void;
  onClose: () => void;
  startScan: () => Promise<boolean>;
  stopScan: () => Promise<boolean>;
  requestPermission: () => Promise<boolean>;
  handleRetry: () => void;
}

export const ZXingScannerContent: React.FC<ZXingScannerContentProps> = ({
  isLoading,
  hasPermission,
  isScanningActive,
  hasScannerError,
  onClose,
  startScan,
  stopScan,
  requestPermission,
  handleRetry
}) => {
  if (isLoading) {
    return <ScannerLoading onClose={onClose} />;
  }

  if (hasPermission === false) {
    return (
      <NoPermissionView
        onRequestPermission={requestPermission}
        onClose={onClose}
      />
    );
  }

  return (
    <ScannerView
      isActive={isScanningActive}
      hasError={hasScannerError}
      onStartScan={startScan}
      onStopScan={stopScan}
      onRetry={handleRetry}
      onClose={onClose}
    />
  );
};
