
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useScanProductHandler } from './hooks/useScanProductHandler';
import { ScanProductDialogHeader } from './components/ScanProductDialogHeader';
import { ScanProductContent } from './components/ScanProductContent';
import { Capacitor } from '@capacitor/core'; 
import { Card } from '@/components/ui/card';
import { Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScanProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void;
}

const ScanProductDialog = ({ open, onOpenChange, onProductAdded }: ScanProductDialogProps) => {
  const { toast } = useToast();
  const isWebEnvironment = !Capacitor.isNativePlatform();
  
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
  
  // تفعيل الماسح تلقائياً عند فتح مربع الحوار في بيئة الأجهزة
  React.useEffect(() => {
    if (open && !showScanner && !isWebEnvironment) {
      setShowScanner(true);
    }
  }, [open, showScanner, setShowScanner, isWebEnvironment]);

  // في بيئة الويب، نعرض رسالة بدلاً من الماسح
  if (isWebEnvironment) {
    return (
      <Dialog 
        open={open} 
        onOpenChange={onOpenChange}
      >
        <DialogContent 
          className="bg-white p-6 border shadow-lg rounded-lg max-w-md mx-auto"
        >
          <Card className="p-6 flex flex-col items-center text-center">
            <Smartphone className="h-16 w-16 text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">المسح غير متاح في المتصفح</h2>
            <p className="text-gray-500 mb-6">
              عملية مسح الباركود متاحة فقط في تطبيق الهاتف المحمول.
              يرجى تنزيل وفتح تطبيق الجوال للقيام بعمليات المسح.
            </p>
            <Button 
              onClick={() => onOpenChange(false)} 
              className="w-full"
              variant="default"
            >
              إغلاق
            </Button>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

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
