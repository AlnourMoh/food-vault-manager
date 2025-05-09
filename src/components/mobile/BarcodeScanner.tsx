
import React, { useRef, useEffect } from 'react';
import { App } from '@capacitor/app';
import { useScannerControls } from './scanner/hooks/useScannerControls';
import { ScannerContainer } from './scanner/ScannerContainer';
import { useScannerInitialization } from './scanner/hooks/useScannerInitialization';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

// Import the augmentation to ensure TypeScript recognizes the extended methods
import '@/types/barcode-scanner-augmentation.d.ts';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const isActive = useRef(false);
  
  // Initialize scanner background
  useScannerInitialization();
  
  // Use scanner controls hook for all scanner operations
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
    handleRetry,
    requestPermission: handleRequestPermission
  } = useScannerControls({ onScan, onClose });
  
  // Add debug information when component mounts
  useEffect(() => {
    const logScannerInfo = async () => {
      try {
        console.log('BarcodeScanner: تهيئة المكون');
        
        // Log platform information
        const platform = Capacitor.getPlatform();
        console.log('BarcodeScanner: المنصة الحالية:', platform);
        console.log('BarcodeScanner: هل المنصة جوال؟', Capacitor.isNativePlatform());
        
        // Log available plugins
        console.log('BarcodeScanner: ملحقات كاباسيتور المتاحة:', Capacitor.isPluginAvailable('MLKitBarcodeScanner') 
          ? 'MLKitBarcodeScanner متاح' 
          : 'MLKitBarcodeScanner غير متاح');
        
        // Log permission state
        console.log('BarcodeScanner: حالة إذن الكاميرا:', hasPermission === true 
          ? 'ممنوح' 
          : hasPermission === false 
            ? 'مرفوض' 
            : 'غير معروف');
        
        // Show toast with scanner status
        if (Capacitor.isNativePlatform()) {
          await Toast.show({
            text: `حالة الماسح: ${hasPermission === true ? 'جاهز' : 'يحتاج إذن'}`,
            duration: 'short'
          });
        }
      } catch (error) {
        console.error('BarcodeScanner: خطأ في تسجيل معلومات الماسح:', error);
      }
    };
    
    logScannerInfo();
  }, [hasPermission]);
  
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
        handleRequestPermission={handleRequestPermission}
        handleRetry={handleRetry}
      />
    </div>
  );
};

export default BarcodeScanner;
