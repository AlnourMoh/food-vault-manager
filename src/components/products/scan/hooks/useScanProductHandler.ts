
import { useState } from 'react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { useDialogEffects } from './useDialogEffects';
import { useProductCodeProcessor } from './useProductCodeProcessor';

interface UseScanProductHandlerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void;
  toast: any;
}

export const useScanProductHandler = ({ 
  open, 
  onOpenChange, 
  onProductAdded,
  toast
}: UseScanProductHandlerProps) => {
  const [hasScannerError, setHasScannerError] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const {
    isProcessing,
    setIsProcessing,
    processScannedCode
  } = useProductCodeProcessor({
    onOpenChange,
    onProductAdded,
    toast
  });

  // Apply dialog effects
  useDialogEffects({
    open,
    setShowScanner,
    setHasScannerError,
    setIsProcessing
  });

  const handleScanResult = async (code: string) => {
    try {
      await processScannedCode(code);
    } catch (error) {
      setHasScannerError(true);
    }
  };

  const handleScanClose = () => {
    onOpenChange(false);
  };

  const handleRetry = () => {
    setHasScannerError(false);
    setShowScanner(true);
  };

  return {
    isProcessing,
    hasScannerError,
    showScanner,
    handleScanResult,
    handleScanClose,
    handleRetry,
    setShowScanner
  };
};
