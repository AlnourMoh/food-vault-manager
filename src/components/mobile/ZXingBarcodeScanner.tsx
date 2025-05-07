
import React, { useEffect, useRef } from 'react';
import { useZXingScanner } from '@/hooks/scanner/useZXingScanner';
import { ScannerContainer } from './scanner/ScannerContainer';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  
  // استخدام hook الماسح الضوئي الجديد
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
  } = useZXingScanner({ onScan, onClose });
  
  // تهيئة المكون
  useEffect(() => {
    console.log('[ZXingBarcodeScanner] تهيئة المكون');
    
    // التحقق من الإذن وبدء المسح إذا كان موجوداً
    if (hasPermission !== false) {
      startScan().catch(e => 
        console.error('[ZXingBarcodeScanner] خطأ في بدء المسح:', e)
      );
    }
    
    // التنظيف عند إلغاء تحميل المكون
    return () => {
      console.log('[ZXingBarcodeScanner] تنظيف المكون');
      
      stopScan().catch(e => 
        console.error('[ZXingBarcodeScanner] خطأ في إيقاف المسح عند التنظيف:', e)
      );
    };
  }, [hasPermission, startScan, stopScan]);

  return (
    <div 
      ref={scannerContainerRef}
      className="fixed inset-0 z-[9999] scanner-container" 
      style={{
        background: 'transparent',
        backgroundColor: 'transparent'
      }}
      data-testid="zxing-barcode-scanner"
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

export default ZXingBarcodeScanner;
