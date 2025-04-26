
import React, { useEffect } from 'react';
import { useScannerInitialization } from './scanner/hooks/useScannerInitialization';
import { useScannerControls } from './scanner/hooks/useScannerControls';
import { ScannerContainer } from './scanner/ScannerContainer';
import { useToast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const { isInitializing } = useScannerInitialization();
  const { toast } = useToast();
  
  const {
    isManualEntry,
    hasScannerError,
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan,
    handleManualEntry,
    handleManualCancel,
    handleRetry,
    isMockScanActive,
    handleManualInput
  } = useScannerControls({ onScan, onClose });

  // Automatically start scanning when component mounts
  useEffect(() => {
    console.log('[BarcodeScanner] المكون تم تحميله، بدء المسح تلقائياً');
    
    let scanTimeout: number;
    
    // Wait for initialization to complete
    if (!isInitializing && !isScanningActive && !isManualEntry && !isMockScanActive) {
      console.log('[BarcodeScanner] بدء المسح تلقائياً بعد تحميل المكون');
      
      // Small delay to ensure UI is ready
      scanTimeout = window.setTimeout(() => {
        try {
          startScan().catch(error => {
            console.error('[BarcodeScanner] خطأ في بدء المسح التلقائي:', error);
            toast({
              title: "خطأ في تهيئة الماسح",
              description: "سيتم محاولة استخدام وضع الإدخال اليدوي",
              variant: "default"
            });
            handleManualEntry();
          });
        } catch (error) {
          console.error('[BarcodeScanner] استثناء غير متوقع عند بدء المسح:', error);
          handleManualEntry();
        }
      }, 500);
    }
    
    // Cleanup when component unmounts
    return () => {
      console.log('[BarcodeScanner] تنظيف المكون');
      window.clearTimeout(scanTimeout);
      document.body.style.background = '';
      document.body.classList.remove('barcode-scanner-active');
      document.body.classList.remove('scanner-transparent-background');
      stopScan();
    };
  }, [isInitializing, isScanningActive, isManualEntry, isMockScanActive]);
  
  // لا نعرض شيئًا أثناء التهيئة
  if (isInitializing) {
    return null;
  }

  return (
    <ScannerContainer
      isManualEntry={isManualEntry}
      hasScannerError={hasScannerError}
      isLoading={isLoading}
      hasPermission={hasPermission}
      isScanningActive={isScanningActive}
      lastScannedCode={lastScannedCode}
      onScan={onScan}
      onClose={onClose}
      startScan={startScan}
      stopScan={stopScan}
      handleManualEntry={handleManualEntry}
      handleManualCancel={handleManualCancel}
      handleRequestPermission={startScan}
      handleRetry={handleRetry}
    />
  );
};

export default BarcodeScanner;
