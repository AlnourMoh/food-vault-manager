
import React, { useEffect } from 'react';
import { useScannerInitialization } from './scanner/hooks/useScannerInitialization';
import { useScannerControls } from './scanner/hooks/useScannerControls';
import { ScannerContainer } from './scanner/ScannerContainer';
import { useScannerUI } from '@/hooks/scanner/useScannerUI';
import { BarcodeScanner as MLKitBarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

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
    console.log('[BarcodeScanner] تهيئة المكون وفتح الكاميرا...');
    
    // فوراً نقوم بإعداد خلفية شفافة للكاميرا
    const initializeScanner = async () => {
      try {
        console.log('[BarcodeScanner] إعداد خلفية شفافة وتهيئة الكاميرا...');
        
        // التأكد من إزالة جميع العناصر التي قد تمنع ظهور الكاميرا
        document.documentElement.style.background = 'transparent';
        document.documentElement.style.backgroundColor = 'transparent';
        document.documentElement.style.setProperty('--background', 'transparent', 'important');
        document.body.style.background = 'transparent';
        document.body.style.backgroundColor = 'transparent';
        document.body.style.setProperty('--background', 'transparent', 'important');
        document.body.classList.add('scanner-active');
        
        // استخدام الوظيفة المساعدة لإعداد الخلفية
        await setupScannerBackground();
        
        // طلب أذونات الكاميرا مباشرة
        if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
          try {
            console.log('[BarcodeScanner] طلب أذونات MLKit...');
            await MLKitBarcodeScanner.requestPermissions();
          } catch (e) {
            console.warn('[BarcodeScanner] خطأ في طلب أذونات MLKit:', e);
          }
        }

        // بدء المسح تلقائيًا
        console.log('[BarcodeScanner] بدء المسح فورًا...');
        await startScan();

        // تأكيد إضافي على مظهر الكاميرا
        document.documentElement.classList.add('transparent-bg');
        document.body.classList.add('transparent-bg');
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
        document.documentElement.classList.remove('transparent-bg');
        document.body.classList.remove('transparent-bg');
        document.documentElement.style.background = '';
        document.documentElement.style.backgroundColor = '';
        document.documentElement.style.removeProperty('--background');
        document.body.style.background = '';
        document.body.style.backgroundColor = '';
        document.body.style.removeProperty('--background');
        
        // تنظيف أي موارد كاميرا متبقية
        if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
          MLKitBarcodeScanner.stopScan().catch(e => 
            console.warn('[BarcodeScanner] خطأ عند إيقاف المسح في التنظيف:', e)
          );
        }
      } catch (error) {
        console.error('[BarcodeScanner] خطأ أثناء التنظيف:', error);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-transparent" style={{
      background: 'transparent',
      backgroundColor: 'transparent',
      '--background': 'transparent'
    } as React.CSSProperties}>
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
