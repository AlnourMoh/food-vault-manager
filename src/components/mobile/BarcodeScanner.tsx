
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
    
    const initializeScanner = async () => {
      try {
        // تطبيق الأنماط الضرورية لظهور الكاميرا
        document.documentElement.style.background = 'transparent';
        document.body.style.background = 'transparent';
        document.body.classList.add('scanner-active');
        
        // إعداد خلفية شفافة للكاميرا
        await setupScannerBackground();
        
        // تفعيل المسح بعد تجهيز الخلفية
        await startScan();
      } catch (error) {
        console.error('[BarcodeScanner] خطأ في تهيئة الماسح:', error);
      }
    };
    
    // تنفيذ التهيئة فوراً
    initializeScanner();
    
    return () => {
      console.log('[BarcodeScanner] تنظيف المكون عند الإلغاء');
      try {
        stopScan();
        cleanupScannerBackground();
        
        // إزالة الفئات والأنماط
        document.body.classList.remove('scanner-active');
        document.documentElement.style.background = '';
        document.body.style.background = '';
      } catch (error) {
        console.error('[BarcodeScanner] خطأ أثناء التنظيف:', error);
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
