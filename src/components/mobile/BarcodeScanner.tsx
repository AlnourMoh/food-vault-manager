
import React, { useEffect, useRef } from 'react';
import { ScannerContainer } from './scanner/ScannerContainer';
import { App } from '@capacitor/app';
import { useScannerState } from '@/hooks/scanner/useScannerState';
import { useMockScanner } from '@/hooks/scanner/useMockScanner';

// Import the augmentation to ensure TypeScript recognizes the extended methods
import '@/types/barcode-scanner-augmentation';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const isActive = useRef(false);
  const scanAttempted = useRef(false);
  
  // استخدام hooks اللازمة
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
  } = useScannerState({ onScan, onClose });
  
  const {
    isMockScanActive,
    handleManualInput,
  } = useMockScanner();

  // تهيئة وتنظيف المكون
  useEffect(() => {
    console.log('[BarcodeScanner] تهيئة المكون...');
    
    if (isActive.current) {
      console.log('[BarcodeScanner] المكون نشط بالفعل');
      return;
    }
    
    isActive.current = true;
    
    // طلب الإذن تلقائيًا عند تحميل المكون
    const checkAndRequestPermission = async () => {
      try {
        // التحقق من حالة الإذن وطلبه إذا لم يكن موجودًا
        if (hasPermission === false) {
          console.log('[BarcodeScanner] لا يوجد إذن، جاري الطلب...');
          await requestPermission();
        }
        
        // بدء المسح فورًا عند التهيئة إذا كان الإذن موجودًا
        if (hasPermission !== false) {
          console.log('[BarcodeScanner] جاري بدء المسح...');
          scanAttempted.current = true;
          startScan().catch(e => 
            console.error('[BarcodeScanner] خطأ في بدء المسح:', e)
          );
        }
      } catch (error) {
        console.error('[BarcodeScanner] خطأ في التحقق من الإذن أو طلبه:', error);
      }
    };
    
    // تنفيذ التحقق وطلب الإذن
    checkAndRequestPermission();
    
    // استعادة الماسح عند عودة التطبيق إلى الواجهة
    const handleAppStateChange = ({ isActive: appIsActive }: { isActive: boolean }) => {
      if (appIsActive && isActive.current && !scanAttempted.current) {
        console.log('[BarcodeScanner] عودة التطبيق للواجهة، إعادة تفعيل الماسح');
        startScan().catch(e => 
          console.error('[BarcodeScanner] خطأ في إعادة تفعيل الماسح:', e)
        );
      }
    };
    
    // إضافة مستمع لحالة التطبيق في الأجهزة المحمولة
    if (window.Capacitor) {
      App.addListener('appStateChange', handleAppStateChange);
    }
    
    // التنظيف عند إلغاء المكون
    return () => {
      console.log('[BarcodeScanner] تنظيف المكون...');
      isActive.current = false;
      
      // إزالة مستمع حالة التطبيق
      if (window.Capacitor) {
        App.removeAllListeners();
      }
      
      // إيقاف المسح
      stopScan().catch(e => 
        console.error('[BarcodeScanner] خطأ في إيقاف المسح عند التنظيف:', e)
      );
    };
  }, [hasPermission, requestPermission, startScan, stopScan]);

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
