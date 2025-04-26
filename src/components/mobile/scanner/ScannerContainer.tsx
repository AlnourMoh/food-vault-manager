
import React from 'react';
import { ScannerLoading } from './ScannerLoading';
import { NoPermissionView } from './NoPermissionView';
import { ScannerView } from './ScannerView';
import { ScannerReadyView } from './ScannerReadyView';
import { DigitalCodeInput } from './DigitalCodeInput';

interface ScannerContainerProps {
  isManualEntry: boolean;
  hasScannerError: boolean;
  isLoading: boolean;
  hasPermission: boolean | null;
  isScanningActive: boolean;
  lastScannedCode: string | null;
  onScan: (code: string) => void;
  onClose: () => void;
  startScan: () => void;
  stopScan: () => void;
  handleManualEntry: () => void;
  handleManualCancel: () => void;
  handleRequestPermission: () => void;
  handleRetry: () => void; // Added this missing prop
}

export const ScannerContainer: React.FC<ScannerContainerProps> = ({
  isManualEntry,
  hasScannerError,
  isLoading,
  hasPermission,
  isScanningActive,
  lastScannedCode,
  onScan,
  onClose,
  startScan,
  stopScan,
  handleManualEntry,
  handleManualCancel,
  handleRequestPermission,
  handleRetry // Added this prop parameter
}) => {
  if (isManualEntry) {
    return (
      <DigitalCodeInput 
        onSubmit={onScan}
        onCancel={handleManualCancel}
      />
    );
  }

  if (isLoading) {
    return <ScannerLoading />;
  }

  return (
    <div className={`fixed inset-0 z-50 ${isScanningActive ? 'scanning-active' : ''}`}>
      {isScanningActive ? (
        <ScannerView 
          onStop={stopScan} 
          hasPermissionError={hasPermission === false}
          onRequestPermission={handleRequestPermission}
          onManualEntry={handleManualEntry}
        />
      ) : (
        hasPermission === false ? (
          <NoPermissionView 
            onClose={onClose} 
            onRequestPermission={handleRequestPermission}
            onManualEntry={handleManualEntry}
          />
        ) : (
          <ScannerReadyView
            lastScannedCode={lastScannedCode}
            onStartScan={startScan}
            onClose={onClose}
            onManualEntry={handleManualEntry}
          />
        )
      )}
    </div>
  );
};
