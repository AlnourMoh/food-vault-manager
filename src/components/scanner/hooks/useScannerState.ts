
import { useState } from 'react';

export const useScannerState = (autoStart = false) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isScanning, setIsScanning] = useState(autoStart);

  return {
    isLoading,
    setIsLoading,
    hasError,
    setHasError,
    isScanning,
    setIsScanning
  };
};
