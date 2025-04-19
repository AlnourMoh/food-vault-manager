
import { useState, useEffect } from 'react';
import { useCameraPermissions } from '../useCameraPermissions';
import { useBarcodeScannerControls } from './useBarcodeScannerControls';

interface UseScannerStateProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useScannerState = ({ onScan, onClose }: UseScannerStateProps) => {
  const { isLoading, hasPermission, requestPermission } = useCameraPermissions();
  const { 
    isScanningActive, 
    lastScannedCode, 
    startScan, 
    stopScan 
  } = useBarcodeScannerControls({ 
    onScan, 
    onClose, 
    hasPermission, 
    requestPermission 
  });
  
  useEffect(() => {
    return () => {
      stopScan();
    };
  }, []);
  
  return {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan
  };
};
