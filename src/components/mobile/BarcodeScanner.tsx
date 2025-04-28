
import React, { useEffect, useRef } from 'react';
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
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  
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
    
    // إضافة الفئات للجسم لتعزيز الشفافية
    document.body.classList.add('scanner-active', 'transparent-bg');
    document.documentElement.classList.add('transparent-bg');
    
    if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
      // تجهيز فئة الشفافية للمستند بأكمله
      document.documentElement.style.setProperty('--ion-background-color', 'transparent', 'important');
      document.documentElement.style.setProperty('background', 'transparent', 'important');
      document.documentElement.style.setProperty('background-color', 'transparent', 'important');
      
      // تطبيق نفس الخصائص على العناصر الرئيسية
      document.body.style.setProperty('--ion-background-color', 'transparent', 'important');
      document.body.style.setProperty('background', 'transparent', 'important');
      document.body.style.setProperty('background-color', 'transparent', 'important');
      
      // جعل جميع الحاويات شفافة
      document.querySelectorAll('.ion-page, ion-content, .content-container').forEach(elem => {
        if (elem instanceof HTMLElement) {
          elem.style.setProperty('--background', 'transparent', 'important');
          elem.style.background = 'transparent';
          elem.style.backgroundColor = 'transparent';
        }
      });
      
      // تهيئة MLKit أولاً
      MLKitBarcodeScanner.isSupported()
        .then(result => {
          if (result.supported) {
            // طلب الأذونات قبل بدء المسح
            MLKitBarcodeScanner.requestPermissions()
              .then(result => {
                if (result.camera === 'granted') {
                  // إعداد الكاميرا وبدء المسح
                  setupScannerBackground().then(() => {
                    startScan();
                  });
                }
              }).catch(console.error);
          }
        }).catch(console.error);
    } else {
      // إعداد الشفافية وبدء المسح مباشرة (للويب/محاكاة)
      setupScannerBackground().then(() => {
        startScan();
      });
    }
    
    // التنظيف عند إلغاء المكون
    return () => {
      console.log('[BarcodeScanner] تنظيف المكون...');
      
      try {
        // إيقاف المسح وإعادة ضبط الخلفية
        stopScan();
        cleanupScannerBackground();
        
        // إزالة الفئات المضافة للشفافية
        document.body.classList.remove('scanner-active', 'transparent-bg');
        document.documentElement.classList.remove('transparent-bg');
        document.documentElement.style.removeProperty('--ion-background-color');
        document.documentElement.style.removeProperty('background');
        document.documentElement.style.removeProperty('background-color');
        document.body.style.removeProperty('--ion-background-color');
        document.body.style.removeProperty('background');
        document.body.style.removeProperty('background-color');
        
        // محاولة إيقاف MLKit إذا كان متاحًا
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
    <div 
      ref={scannerContainerRef}
      className="fixed inset-0 z-[9999]" 
      style={{
        background: 'transparent',
        backgroundColor: 'transparent',
        visibility: 'visible'
      }}
      data-testid="barcode-scanner-container"
    >
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
