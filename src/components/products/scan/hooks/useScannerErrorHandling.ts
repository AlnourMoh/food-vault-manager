
import { useState } from 'react';

export interface ScannerErrorHandlingProps {
  onOpenChange: (open: boolean) => void;
}

export const useScannerErrorHandling = ({ onOpenChange }: ScannerErrorHandlingProps) => {
  const [hasScannerError, setHasScannerError] = useState(false);

  const handleScanClose = () => {
    onOpenChange(false);
  };

  const handleRetry = () => {
    setHasScannerError(false);
  };

  return {
    hasScannerError,
    setHasScannerError,
    handleScanClose,
    handleRetry
  };
};
