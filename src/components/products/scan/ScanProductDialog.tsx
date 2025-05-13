
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useScanProductHandler } from './hooks/useScanProductHandler';
import { ScanProductDialogHeader } from './components/ScanProductDialogHeader';
import { ScanProductContent } from './components/ScanProductContent';

interface ScanProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void;
}

const ScanProductDialog = ({ open, onOpenChange, onProductAdded }: ScanProductDialogProps) => {
  const { toast } = useToast();
  
  const {
    isProcessing,
    hasScannerError,
    showScanner,
    handleScanResult,
    handleScanClose,
    handleRetry,
    setShowScanner
  } = useScanProductHandler({ 
    open, 
    onOpenChange, 
    onProductAdded, 
    toast 
  });
  
  // تفعيل الماسح تلقائياً عند فتح مربع الحوار
  React.useEffect(() => {
    if (open && !showScanner) {
      setShowScanner(true);
    }
  }, [open, showScanner, setShowScanner]);

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
      modal={false} // مهم لضمان عدم حجب الكاميرا
    >
      <DialogContent 
        className="bg-white p-0 border shadow-lg rounded-lg" 
        style={{
          maxWidth: '100vw',
          width: '100%',
          height: '100vh',
          margin: '0',
          padding: '0',
          overflow: 'hidden'
        }}
      >
        <ScanProductDialogHeader />
        
        <ScanProductContent 
          hasScannerError={hasScannerError}
          showScanner={showScanner}
          isProcessing={isProcessing}
          onRetry={handleRetry}
          onScan={handleScanResult}
          onClose={handleScanClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ScanProductDialog;
