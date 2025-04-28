
import React, { useEffect } from 'react';
import { useScannerInitialization } from './scanner/hooks/useScannerInitialization';
import { useScannerControls } from './scanner/hooks/useScannerControls';
import { ScannerContainer } from './scanner/ScannerContainer';
import { useScannerUI } from '@/hooks/scanner/useScannerUI';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const { isInitializing } = useScannerInitialization();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();
  
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

  // بدء المسح فوراً عند تحميل المكون - بدون تأخير
  useEffect(() => {
    console.log('[BarcodeScanner] تهيئة المكون وبدء المسح فوراً...');
    
    // إعداد خلفية الماسح فوراً، مهم لتفعيل الكاميرا
    setupScannerBackground().catch(e => 
      console.error('[BarcodeScanner] خطأ في إعداد خلفية الماسح:', e)
    );
    
    // بدء المسح فوراً
    startScan().catch(e => 
      console.error('[BarcodeScanner] خطأ في البدء الفوري للمسح:', e)
    );
    
    return () => {
      console.log('[BarcodeScanner] تنظيف المكون عند الإلغاء');
      try {
        stopScan();
        cleanupScannerBackground();
      } catch (error) {
        console.error('[BarcodeScanner] خطأ أثناء التنظيف:', error);
      } finally {
        // تأكد من تنظيف نمط الخلفية في جميع الحالات
        document.body.style.background = '';
        document.body.style.opacity = '';
        document.body.classList.remove('barcode-scanner-active');
        document.body.classList.remove('scanner-transparent-background');
      }
    };
  }, []);

  return (
    <ScannerContainer
      isManualEntry={isManualEntry}
      hasScannerError={hasScannerError}
      isLoading={false} // دائما نعيد false للتحميل لتسريع تفعيل الكاميرا
      hasPermission={true} // نفترض دائما وجود الإذن لتفعيل الكاميرا
      isScanningActive={true} // دائما نعتبر المسح نشط ليتم عرض الكاميرا مباشرة
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
