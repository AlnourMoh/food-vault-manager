
import React, { useEffect, useRef } from 'react';
import { useScannerInitialization } from './scanner/hooks/useScannerInitialization';
import { useScannerControls } from './scanner/hooks/useScannerControls';
import { ScannerContainer } from './scanner/ScannerContainer';
import { useScannerUI } from '@/hooks/scanner/useScannerUI';
import { BarcodeScanner as MLKitBarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import styles from './scanner/scanner.module.css';

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

  // تهيئة وتنظيف المكون بنهج أكثر احتواءً
  useEffect(() => {
    console.log('[BarcodeScanner] تهيئة المكون وفتح الكاميرا...');
    
    // إضافة الفئات للجسم مع نطاق محدود
    const appHeader = document.querySelector('header');
    if (appHeader) appHeader.classList.add('app-header');
    
    const appFooter = document.querySelector('footer, nav');
    if (appFooter) appFooter.classList.add('app-footer');
    
    // إعداد البوابة المحتواة للماسح
    const scannerRoot = document.createElement('div');
    scannerRoot.id = 'scanner-root';
    scannerRoot.className = styles.scannerRoot;
    document.body.appendChild(scannerRoot);
    
    if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
      // تهيئة MLKit بشكل أكثر احتواءً
      MLKitBarcodeScanner.isSupported()
        .then(result => {
          if (result.supported) {
            MLKitBarcodeScanner.requestPermissions()
              .then(result => {
                if (result.camera === 'granted') {
                  setupScannerBackground().then(() => {
                    startScan();
                  });
                }
              }).catch(error => {
                console.error('[BarcodeScanner] خطأ في طلب الأذونات:', error);
                handleRetry();
              });
          }
        }).catch(error => {
          console.error('[BarcodeScanner] خطأ في التحقق من دعم MLKit:', error);
          handleRetry();
        });
    } else {
      setupScannerBackground().then(() => {
        startScan();
      });
    }
    
    // التنظيف عند إلغاء المكون - تحسين عملية التنظيف
    return () => {
      console.log('[BarcodeScanner] تنظيف المكون...');
      
      try {
        // إيقاف المسح وإعادة ضبط الخلفية
        stopScan();
        cleanupScannerBackground();
        
        // إزالة الفئات المضافة للهيدر والفوتر
        const appHeader = document.querySelector('.app-header');
        if (appHeader) appHeader.classList.remove('app-header');
        
        const appFooter = document.querySelector('.app-footer');
        if (appFooter) appFooter.classList.remove('app-footer');
        
        // إزالة جذر الماسح
        const scannerRoot = document.getElementById('scanner-root');
        if (scannerRoot) scannerRoot.remove();
        
        // محاولة إيقاف MLKit إذا كان متاحًا
        if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
          MLKitBarcodeScanner.stopScan().catch(e => 
            console.warn('[BarcodeScanner] خطأ عند إيقاف المسح في التنظيف:', e)
          );
        }
        
        // محاولة نهائية للتأكد من تنظيف كل شيء
        setTimeout(() => {
          document.body.classList.remove(styles.scannerActive, 'scanner-mode');
        }, 500);
      } catch (error) {
        console.error('[BarcodeScanner] خطأ أثناء التنظيف:', error);
      }
    };
  }, []);

  return (
    <div 
      ref={scannerContainerRef}
      className="fixed inset-0 z-[9999] scanner-container" 
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
