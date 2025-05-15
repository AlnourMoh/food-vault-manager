import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';
import { useCameraPermissions } from './permissions/useCameraPermissions';
import { useMLKitScanner } from './providers/useMLKitScanner';
import { useScannerUI } from './ui/useScannerUI';

interface UseScannerStateProps {
  autoStart?: boolean;
  onScan?: (code: string) => void;
  onClose?: () => void;
}

export const useScannerState = (props?: UseScannerStateProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  const autoStart = props?.autoStart || false;
  const onScan = props?.onScan || ((code: string) => console.log('Scanned:', code));
  const onClose = props?.onClose || (() => {});
  
  const { hasPermission: cameraPermission, requestPermission } = useCameraPermissions();
  const { startMLKitScan, stopMLKitScan, isMLKitScanActive } = useMLKitScanner();
  const { setupScannerBackground, restoreUIAfterScanning, cleanup } = useScannerUI();
  
  const { toast } = useToast();

  return {
    isLoading,
    setIsLoading,
    hasError,
    setHasError,
    isScanning: isMLKitScanActive || isScanning,
    setIsScanning,
    hasPermission: cameraPermission,
    lastScannedCode,
    setLastScannedCode
  };
};
