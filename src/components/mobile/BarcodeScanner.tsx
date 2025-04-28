
import React, { useEffect } from 'react';
import { useScannerInitialization } from './scanner/hooks/useScannerInitialization';
import { useScannerControls } from './scanner/hooks/useScannerControls';
import { ScannerContainer } from './scanner/ScannerContainer';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const { isInitializing } = useScannerInitialization();
  
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
    handleRetry
  } = useScannerControls({ 
    onScan: (code) => {
      console.log('[BarcodeScanner] تم المسح بنجاح:', code);
      onScan(code);
    }, 
    onClose: () => {
      console.log('[BarcodeScanner] تم الإغلاق');
      stopScan();
      onClose();
    } 
  });

  // تنظيف الموارد عند إلغاء تحميل المكون
  useEffect(() => {
    console.log('[BarcodeScanner] تهيئة المكون');
    
    return () => {
      console.log('[BarcodeScanner] تنظيف المكون عند الإلغاء');
      try {
        stopScan();
      } catch (error) {
        console.error('[BarcodeScanner] خطأ أثناء التنظيف:', error);
      } finally {
        // تأكد من تنظيف نمط الخلفية في جميع الحالات
        document.body.style.background = '';
        document.body.classList.remove('barcode-scanner-active');
        document.body.classList.remove('scanner-transparent-background');
      }
    };
  }, []);
  
  // لا نعرض شيئًا أثناء التهيئة
  if (isInitializing) {
    console.log('[BarcodeScanner] ما زال في مرحلة التهيئة');
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
