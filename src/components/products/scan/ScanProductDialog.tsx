
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useScanProductHandler } from './hooks/useScanProductHandler';
import { ScanProductDialogHeader } from './components/ScanProductDialogHeader';
import { ScanProductContent } from './components/ScanProductContent';
import { Capacitor } from '@capacitor/core'; 
import { BrowserView } from '@/components/mobile/scanner/components/BrowserView';

interface ScanProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void;
}

const ScanProductDialog = ({ open, onOpenChange, onProductAdded }: ScanProductDialogProps) => {
  const { toast } = useToast();
  const [isWebEnvironment, setIsWebEnvironment] = useState(true);
  
  // تحقق من بيئة التشغيل عند فتح الحوار
  useEffect(() => {
    if (open) {
      const isNative = Capacitor.isNativePlatform();
      const platform = Capacitor.getPlatform();
      
      console.log('ScanProductDialog: هل نحن في بيئة الجوال؟', isNative);
      console.log('ScanProductDialog: منصة التشغيل:', platform);
      
      setIsWebEnvironment(!isNative);
      
      // إذا كنا في بيئة الجوال وليس الويب، نعرض رسالة تأكيد
      if (isNative) {
        toast({
          title: "تفعيل الماسح الضوئي",
          description: "جاري تشغيل الماسح الضوئي للباركود..."
        });
      }
    }
  }, [open, toast]);
  
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
      console.log('ScanProductDialog: تفعيل الماسح تلقائياً في بيئة الجوال');
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
          <BrowserView onClose={() => onOpenChange(false)} />
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
