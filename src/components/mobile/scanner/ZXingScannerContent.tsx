
import React from 'react';
import { ScannerView } from './components/ScannerView';
import { NoPermissionView } from './NoPermissionView';
import { ScannerLoading } from './ScannerLoading';

interface ZXingScannerContentProps {
  isLoading: boolean;
  hasPermission: boolean | null;
  isScanningActive: boolean;
  hasScannerError: boolean;
  cameraActive: boolean;
  onScan: (code: string) => void;
  onClose: () => void;
  startScan: () => Promise<boolean>;
  stopScan: () => Promise<boolean>;
  requestPermission: () => Promise<boolean>;
  handleRetry: () => void;
  onManualEntry?: () => void;
}

export const ZXingScannerContent: React.FC<ZXingScannerContentProps> = ({
  isLoading,
  hasPermission,
  isScanningActive,
  hasScannerError,
  cameraActive,
  onClose,
  startScan,
  stopScan,
  requestPermission,
  handleRetry,
  onManualEntry
}) => {
  if (isLoading) {
    return <ScannerLoading onClose={onClose} />;
  }

  if (hasPermission === false) {
    return (
      <NoPermissionView
        onRequestPermission={requestPermission}
        onClose={onClose}
        onManualEntry={onManualEntry}
      />
    );
  }

  return (
    <ScannerView
      isActive={isScanningActive}
      cameraActive={cameraActive}
      hasError={hasScannerError}
      onStartScan={startScan}
      onStopScan={stopScan}
      onRetry={handleRetry}
      onClose={onClose}
      onManualEntry={onManualEntry}
    />
  );
};
