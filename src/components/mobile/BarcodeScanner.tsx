
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

  // بدء المسح تلقائيًا عند تحميل المكون
  useEffect(() => {
    console.log('[BarcodeScanner] تهيئة المكون وبدء المسح تلقائيًا');
    
    // تأخير قصير للسماح للمكون بالتحميل الكامل
    const timer = setTimeout(() => {
      console.log('[BarcodeScanner] بدء المسح تلقائيًا بعد التحميل');
      startScan().catch(e => console.error('[BarcodeScanner] خطأ في البدء التلقائي للمسح:', e));
    }, 300);
    
    return () => {
      console.log('[BarcodeScanner] تنظيف المكون عند الإلغاء');
      clearTimeout(timer);
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
  
  // لا نعرض شيئًا أثناء التهيئة - لكنها الآن سريعة جداً
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
