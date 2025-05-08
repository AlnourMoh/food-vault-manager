
import React, { useEffect } from 'react';
import { useZXingScanner } from '@/hooks/scanner/useZXingScanner';
import { ScannerView } from '@/components/mobile/scanner/ScannerView';
import { NoPermissionView } from '@/components/mobile/scanner/NoPermissionView';
import { ScannerLoading } from '@/components/mobile/scanner/ScannerLoading';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({
  onScan,
  onClose,
  autoStart = true
}) => {
  const {
    isLoading,
    hasPermission,
    isScanningActive,
    hasScannerError,
    startScan,
    stopScan,
    requestPermission,
    handleRetry,
  } = useZXingScanner({
    onScan,
    onClose,
    autoStart
  });

  // عند تحميل المكون، نبدأ المسح إذا كان الخيار مفعل
  useEffect(() => {
    console.log('[ZXingBarcodeScanner] تم تحميل المكون، حالة البدء التلقائي:', autoStart);
    
    // عند إلغاء تحميل المكون، نتأكد من إيقاف المسح
    return () => {
      console.log('[ZXingBarcodeScanner] تم إلغاء تحميل المكون، إيقاف المسح');
      stopScan();
    };
  }, [autoStart, stopScan]);

  const handleCloseScanner = () => {
    stopScan();
    onClose();
  };

  if (isLoading) {
    return <ScannerLoading onClose={handleCloseScanner} />;
  }

  if (hasPermission === false) {
    return (
      <NoPermissionView
        onRequestPermission={requestPermission}
        onClose={handleCloseScanner}
      />
    );
  }

  return (
    <ScannerView
      isActive={isScanningActive}
      hasError={hasScannerError}
      onStartScan={startScan}
      onStopScan={stopScan}
      onRetry={handleRetry}
      onClose={handleCloseScanner}
    />
  );
};

export default ZXingBarcodeScanner;
