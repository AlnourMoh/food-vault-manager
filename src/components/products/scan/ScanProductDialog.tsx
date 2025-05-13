
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useScanProductHandler } from './hooks/useScanProductHandler';
import { ScanProductDialogHeader } from './components/ScanProductDialogHeader';
import { ScanProductContent } from './components/ScanProductContent';
import { BrowserView } from '@/components/mobile/scanner/components/BrowserView';
import CapacitorTester from '@/components/mobile/CapacitorTester';
import { useScannerEnvironment } from '@/hooks/useScannerEnvironment';

interface ScanProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void;
}

const ScanProductDialog = ({ open, onOpenChange, onProductAdded }: ScanProductDialogProps) => {
  const { toast } = useToast();
  const [showDebug, setShowDebug] = useState(false);
  const environment = useScannerEnvironment();
  const [dialogForceOpen, setDialogForceOpen] = useState(false);
  
  // تشخيص البيئة عند الفتح
  useEffect(() => {
    if (open) {
      console.log('ScanProductDialog: بيئة التشغيل الحالية:', environment);
      setDialogForceOpen(true);
      
      // إذا كنا في بيئة الجوال وليس الويب، نعرض رسالة تأكيد
      if (environment.isNativePlatform || environment.isInAppWebView) {
        toast({
          title: "تفعيل الماسح الضوئي",
          description: "جاري تشغيل الماسح الضوئي للباركود..."
        });
      }
    }
  }, [open, toast, environment]);
  
  // منع إغلاق الحوار تلقائيًا
  const handleOpenChange = (newOpenState: boolean) => {
    // إذا كان المستخدم يحاول إغلاق الحوار، نحافظ على فتحه إلا لو كانت العملية من خلال زر الإغلاق الصريح
    if (!newOpenState && dialogForceOpen) {
      console.log('ScanProductDialog: محاولة إغلاق الحوار - تم تجاهلها');
      return;
    }
    onOpenChange(newOpenState);
  };
  
  // دالة لإغلاق الحوار بشكل صريح
  const handleExplicitClose = () => {
    console.log('ScanProductDialog: إغلاق صريح للحوار');
    setDialogForceOpen(false);
    onOpenChange(false);
  };
  
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
    onOpenChange: handleExplicitClose, 
    onProductAdded, 
    toast 
  });
  
  // تفعيل الماسح تلقائياً عند فتح مربع الحوار في بيئة الأجهزة
  useEffect(() => {
    if (open && !showScanner && (environment.isNativePlatform || environment.isInAppWebView)) {
      console.log('ScanProductDialog: تفعيل الماسح تلقائياً في بيئة الجوال/WebView');
      // تأخير قصير لضمان استقرار واجهة المستخدم
      const timer = setTimeout(() => {
        setShowScanner(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [open, showScanner, setShowScanner, environment]);

  // في بيئة الويب الخالصة (ليس WebView)، نعرض رسالة بدلاً من الماسح
  if (!environment.isNativePlatform && !environment.isInAppWebView) {
    return (
      <Dialog 
        open={open} 
        onOpenChange={handleOpenChange}
      >
        <DialogContent 
          className="bg-white p-6 border shadow-lg rounded-lg max-w-md mx-auto"
        >
          <BrowserView onClose={handleExplicitClose} />
          
          {showDebug && (
            <div className="mt-4">
              <CapacitorTester />
            </div>
          )}
          
          <div className="mt-2 flex justify-center">
            <button 
              className="text-sm text-blue-500 underline"
              onClick={() => setShowDebug(prev => !prev)}
            >
              {showDebug ? "إخفاء التشخيص" : "عرض معلومات التشخيص"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open || dialogForceOpen} 
      onOpenChange={handleOpenChange}
      modal={false}
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
          onClose={handleExplicitClose}
        />
        
        {showDebug && (
          <div className="absolute bottom-4 left-0 right-0 mx-4">
            <CapacitorTester />
          </div>
        )}
        
        <button 
          className="absolute bottom-2 left-0 right-0 mx-auto text-xs text-blue-500 underline"
          onClick={() => setShowDebug(prev => !prev)}
          style={{ zIndex: 9999 }}
        >
          {showDebug ? "إخفاء التشخيص" : "عرض معلومات التشخيص"}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ScanProductDialog;
