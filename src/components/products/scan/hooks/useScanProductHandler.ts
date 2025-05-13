
import { useState, useEffect } from 'react';
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
  const [scanInProgress, setScanInProgress] = useState(false);

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
  
  // تسجيل حالة المسح للتشخيص
  useEffect(() => {
    console.log('ScanProductHandler: حالة المسح -', { 
      open, 
      showScanner, 
      hasScannerError, 
      isProcessing,
      scanInProgress 
    });
  }, [open, showScanner, hasScannerError, isProcessing, scanInProgress]);

  const handleScanResult = async (code: string) => {
    try {
      console.log('ScanProductHandler: تم استلام نتيجة المسح:', code);
      setScanInProgress(true);
      
      // عرض نتيجة المسح للتأكيد قبل المعالجة
      toast({
        title: "تم مسح الباركود",
        description: `تم مسح الرمز: ${code}`
      });
      
      // معالجة الرمز الممسوح
      await processScannedCode(code);
      
      // لا نغلق الماسح تلقائيًا بعد النجاح، بل ننتظر تفاعل المستخدم
    } catch (error) {
      console.error('ScanProductHandler: خطأ في معالجة الرمز:', error);
      setHasScannerError(true);
      
      toast({
        title: "خطأ في المسح",
        description: typeof error === 'string' ? error : "حدث خطأ أثناء معالجة نتيجة المسح",
        variant: "destructive"
      });
    } finally {
      setScanInProgress(false);
    }
  };

  const handleScanClose = () => {
    console.log('ScanProductHandler: إغلاق الماسح');
    // إزالة التأخير لأنه قد يسبب مشاكل في إغلاق الحوار
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
    scanInProgress,
    handleScanResult,
    handleScanClose,
    handleRetry,
    setShowScanner
  };
};
