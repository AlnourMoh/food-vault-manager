
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

  // تهيئة وتنظيف المكون
  useEffect(() => {
    console.log('[BarcodeScanner] تهيئة المكون...');
    
    // فوراً نقوم بإعداد خلفية شفافة للكاميرا
    const initializeScanner = async () => {
      try {
        console.log('[BarcodeScanner] إعداد خلفية شفافة وتهيئة الكاميرا...');
        
        // إزالة أي أنماط قد تمنع ظهور الكاميرا
        document.documentElement.style.background = 'transparent';
        document.documentElement.style.backgroundColor = 'transparent';
        document.body.style.background = 'transparent';
        document.body.style.backgroundColor = 'transparent';
        document.body.classList.add('scanner-active');
        
        // استخدام الوظيفة المساعدة لإعداد الخلفية
        await setupScannerBackground();
        
        // بدء المسح تلقائيًا
        console.log('[BarcodeScanner] بدء المسح فورًا...');
        await startScan();
      } catch (error) {
        console.error('[BarcodeScanner] خطأ في تهيئة الماسح:', error);
      }
    };
    
    // تنفيذ التهيئة فوراً
    initializeScanner();
    
    // التنظيف عند إلغاء المكون
    return () => {
      console.log('[BarcodeScanner] تنظيف المكون...');
      
      try {
        // إيقاف المسح وإعادة ضبط الخلفية
        stopScan();
        cleanupScannerBackground();
        
        // إزالة الفئات والأنماط المضافة
        document.body.classList.remove('scanner-active');
        document.documentElement.style.background = '';
        document.documentElement.style.backgroundColor = '';
        document.body.style.background = '';
        document.body.style.backgroundColor = '';
      } catch (error) {
        console.error('[BarcodeScanner] خطأ أثناء التنظيف:', error);
      }
    };
  }, []);

  // تهيئة إضافية عندما يتغير وضع المسح النشط
  useEffect(() => {
    console.log('[BarcodeScanner] تغيير وضع المسح النشط:', isScanningActive);
    
    if (isScanningActive) {
      // إعادة تطبيق الشفافية عند تفعيل المسح
      document.documentElement.style.background = 'transparent';
      document.documentElement.style.backgroundColor = 'transparent';
      document.body.style.background = 'transparent';
      document.body.style.backgroundColor = 'transparent';
    }
  }, [isScanningActive]);

  return (
    <div className="fixed inset-0 z-[9999] bg-transparent">
      <ScannerContainer
        isManualEntry={isManualEntry}
        hasScannerError={hasScannerError}
        isLoading={false}
        hasPermission={true}
        isScanningActive={true}
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
    </div>
  );
};

export default BarcodeScanner;
