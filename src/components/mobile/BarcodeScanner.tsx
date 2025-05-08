
import React, { useEffect, useRef, useState } from 'react';
import { ScannerContainer } from './scanner/ScannerContainer';
import { App } from '@capacitor/app';
import { useScannerState } from '@/hooks/scanner/useScannerState';
import { useMockScanner } from '@/hooks/scanner/useMockScanner';
import { Toast } from '@capacitor/toast';

// Import the augmentation to ensure TypeScript recognizes the extended methods
import '@/types/barcode-scanner-augmentation.d.ts';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const isActive = useRef(false);
  const scanAttempted = useRef(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  
  // استخدام hooks اللازمة
  const {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    isManualEntry,
    hasScannerError,
    startScan: originalStartScan,
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

  // Wrapper function for scanner start with proper type signature
  const startScan = async (): Promise<boolean> => {
    try {
      console.log('[BarcodeScanner] Starting scan with camera initialization check');
      
      // Try to initialize camera if not already done
      if (!cameraInitialized) {
        console.log('[BarcodeScanner] Camera not initialized, initializing now');
        
        // Add a toast to show we're activating the camera
        await Toast.show({
          text: 'جاري تفعيل الكاميرا...',
          duration: 'short'
        });
        
        // Wait a moment to let the UI update
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setCameraInitialized(true);
      }
      
      // Call the original function and preserve its boolean return value
      const success = await originalStartScan();
      
      if (!success) {
        console.log('[BarcodeScanner] Scan start was not successful');
        await Toast.show({
          text: 'فشل في بدء تشغيل الكاميرا، يرجى المحاولة مرة أخرى',
          duration: 'short'
        });
      }
      
      return success; // Return the success boolean value
      
    } catch (error) {
      console.error("[BarcodeScanner] Error starting scan:", error);
      await Toast.show({
        text: 'حدث خطأ أثناء تشغيل الكاميرا',
        duration: 'short'
      });
      return false; // Return false in case of error
    }
  };

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
  }, [hasPermission, requestPermission, stopScan]);

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
