
import React, { useEffect, useRef } from 'react';
import { ScannerContainer } from './scanner/ScannerContainer';
import { useMLKitScanner } from '@/hooks/scanner/useMLKitScanner';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const isActive = useRef(false);
  
  // استخدام الـ hook الجديد للماسح الضوئي
  const {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    isManualEntry,
    hasScannerError,
    startScan,
    stopScan,
    requestPermission,
    handleManualEntry,
    handleManualCancel,
    handleRetry
  } = useMLKitScanner({ 
    onScan: (code) => {
      console.log('[BarcodeScanner] تم المسح بنجاح:', code);
      onScan(code);
    }, 
    onClose 
  });

  // تهيئة وتنظيف المكون
  useEffect(() => {
    console.log('[BarcodeScanner] تهيئة المكون...');
    
    if (isActive.current) {
      console.log('[BarcodeScanner] المكون نشط بالفعل');
      return;
    }
    
    isActive.current = true;
    
    // بدء المسح تلقائيًا عند تحميل المكون
    if (!isScanningActive) {
      startScan().catch(e => 
        console.error('[BarcodeScanner] خطأ في بدء المسح التلقائي:', e)
      );
    }
    
    // التنظيف عند إلغاء المكون
    return () => {
      console.log('[BarcodeScanner] تنظيف المكون...');
      isActive.current = false;
      
      // إيقاف المسح
      stopScan().catch(e => 
        console.error('[BarcodeScanner] خطأ في إيقاف المسح عند التنظيف:', e)
      );
    };
  }, []);

  return (
    <div 
      ref={scannerContainerRef}
      className="fixed inset-0 z-[9999] scanner-container" 
      style={{
        background: 'transparent',
        backgroundColor: 'transparent'
      }}
      data-testid="barcode-scanner-container"
    >
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
        handleRequestPermission={requestPermission}
        handleRetry={handleRetry}
      />
    </div>
  );
};

export default BarcodeScanner;
