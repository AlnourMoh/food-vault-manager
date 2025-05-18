
import React, { useEffect, useState } from 'react';
import { useScannerControls } from './scanner/hooks/useScannerControls';
import { ScannerContainer } from './scanner/ScannerContainer';
import { Capacitor } from '@capacitor/core';

// Import the augmentation to ensure TypeScript recognizes the extended methods
import '@/types/barcode-scanner-augmentation.d.ts';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({
  onScan,
  onClose,
  autoStart = false
}) => {
  const [hasBegun, setHasBegun] = useState(false);
  
  // استخدام وحدات التحكم في الماسح الضوئي
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
    requestPermission,
    handleRetry,
    cameraActive,
    setCameraActive
  } = useScannerControls({ onScan, onClose });
  
  // تنظيف عند إزالة المكون
  useEffect(() => {
    console.log('ZXingBarcodeScanner: تحميل المكون');
    
    // تفعيل الكاميرا تلقائيًا عند التحميل إذا تم تعيين autoStart
    if (autoStart && !hasBegun) {
      console.log('ZXingBarcodeScanner: بدء المسح تلقائيًا');
      setHasBegun(true);
      
      // تأخير قصير لضمان تحميل المكون بالكامل
      const timer = setTimeout(() => {
        // تنشيط الكاميرا تلقائيًا
        setCameraActive(true);
        
        // بدء المسح فقط إذا كنا في بيئة تطبيق أصلية
        if (Capacitor.isNativePlatform()) {
          console.log('ZXingBarcodeScanner: بدء المسح تلقائيًا في بيئة تطبيق أصلية');
          startScan().catch(error => {
            console.error('ZXingBarcodeScanner: خطأ في بدء المسح:', error);
          });
        } else {
          console.log('ZXingBarcodeScanner: تفعيل وضع المحاكاة في بيئة الويب');
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      console.log('ZXingBarcodeScanner: تنظيف الموارد عند الإزالة');
      stopScan().catch(error => {
        console.error('ZXingBarcodeScanner: خطأ في إيقاف المسح عند التنظيف:', error);
      });
    };
  }, [autoStart, hasBegun, startScan, stopScan, setCameraActive]);
  
  // حفظ معلومات تشخيصية عن حالة الماسح
  useEffect(() => {
    console.log('ZXingBarcodeScanner: حالة الماسح -', {
      isManualEntry,
      hasScannerError,
      isLoading,
      hasPermission,
      isScanningActive,
      cameraActive
    });
  }, [isManualEntry, hasScannerError, isLoading, hasPermission, isScanningActive, cameraActive]);
  
  return (
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
      cameraActive={cameraActive}
    />
  );
};

export default ZXingBarcodeScanner;
