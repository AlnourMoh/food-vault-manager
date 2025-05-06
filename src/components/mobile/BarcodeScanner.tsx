
import React, { useEffect, useRef } from 'react';
import { ScannerContainer } from './scanner/ScannerContainer';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { useMLKitScanner } from '@/hooks/scanner/providers/useMLKitScanner';
import { useScannerUI } from '@/hooks/scanner/useScannerUI';
import { useMockScanner } from '@/hooks/scanner/useMockScanner';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const isActive = useRef(false);
  const scanAttempted = useRef(false);
  
  // استخدام hooks اللازمة
  const { isLoading, hasPermission, requestPermission } = useCameraPermissions();
  const { startMLKitScan, isScanning } = useMLKitScanner();
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();
  const { 
    startMockScan, 
    isMockScanActive, 
    handleManualInput, 
    cancelMockScan 
  } = useMockScanner();
  
  // حالة المكون الداخلية
  const [isScanningActive, setIsScanningActive] = React.useState(false);
  const [lastScannedCode, setLastScannedCode] = React.useState<string | null>(null);
  const [isManualEntry, setIsManualEntry] = React.useState(false);
  const [hasScannerError, setHasScannerError] = React.useState(false);

  // وظائف المسح
  const startScan = async () => {
    try {
      console.log('[BarcodeScanner] بدء المسح...');
      
      if (isScanningActive) {
        console.log('[BarcodeScanner] المسح نشط بالفعل');
        return true;
      }
      
      // التحقق من الأذونات وطلبها إذا لزم الأمر
      if (hasPermission === false) {
        const granted = await requestPermission();
        if (!granted) {
          console.log('[BarcodeScanner] لم يتم منح إذن الكاميرا');
          return false;
        }
      }
      
      // إعداد الواجهة للمسح
      await setupScannerBackground();
      setIsScanningActive(true);
      
      // بدء المسح
      const success = await startMLKitScan((code) => {
        console.log('[BarcodeScanner] تم المسح بنجاح:', code);
        scanAttempted.current = true;
        setLastScannedCode(code);
        onScan(code);
      });
      
      if (!success) {
        console.log('[BarcodeScanner] فشل المسح');
        stopScan();
        setHasScannerError(true);
      }
      
      return success;
    } catch (error) {
      console.error('[BarcodeScanner] خطأ في بدء المسح:', error);
      stopScan();
      setHasScannerError(true);
      return false;
    }
  };

  const stopScan = async () => {
    try {
      console.log('[BarcodeScanner] إيقاف المسح...');
      setIsScanningActive(false);
      await cleanupScannerBackground();
      return true;
    } catch (error) {
      console.error('[BarcodeScanner] خطأ في إيقاف المسح:', error);
      return false;
    }
  };

  const handleManualEntry = () => {
    setIsManualEntry(true);
    stopScan();
    startMockScan(onScan);
  };

  const handleManualCancel = () => {
    setIsManualEntry(false);
    cancelMockScan();
  };

  const handleRetry = () => {
    setHasScannerError(false);
    startScan();
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
          startScan().catch(e => 
            console.error('[BarcodeScanner] خطأ في بدء المسح:', e)
          );
        }
      } catch (error) {
        console.error('[BarcodeScanner] خطأ في التحقق من الإذن أو طلبه:', error);
        
        // محاولة إظهار رسالة للمستخدم
        if (window.Capacitor) {
          Toast.show({
            text: 'يرجى تمكين إذن الكاميرا من إعدادات الجهاز',
            duration: 'long'
          }).catch(() => {});
        }
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
  }, [hasPermission, requestPermission]);

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
