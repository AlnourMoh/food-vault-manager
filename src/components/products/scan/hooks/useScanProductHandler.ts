
import { useDialogState } from './useDialogState';
import { useScanResultProcessor } from './useScanResultProcessor';
import { useScannerErrorHandling } from './useScannerErrorHandling';

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
  // استخدام الهوكس المنفصلة
  const { showScanner, setShowScanner } = useDialogState({ open, onOpenChange });
  
  const { isProcessing, handleScanResult } = useScanResultProcessor({
    onOpenChange,
    onProductAdded,
    toast
  });
  
  const { hasScannerError, setHasScannerError, handleScanClose, handleRetry } = useScannerErrorHandling({
    onOpenChange
  });

  // تصدير واجهة موحدة تحافظ على نفس الوظائف التي كانت موجودة سابقاً
  return {
    isProcessing,
    hasScannerError,
    showScanner,
    handleScanResult,
    handleScanClose,
    handleRetry,
    setShowScanner,
    setHasScannerError
  };
};
