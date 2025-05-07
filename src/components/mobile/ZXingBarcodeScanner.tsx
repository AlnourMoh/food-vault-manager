
import React, { useEffect, useRef } from 'react';
import { useZXingScanner } from '@/hooks/scanner/useZXingScanner';
import { ScannerContainer } from './scanner/ScannerContainer';
import { Toast } from '@capacitor/toast';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  
  // استخدام hook الماسح الضوئي مع طلب الأذونات المباشر
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
  
  // تهيئة المكون مع طلب الأذونات إن لم تكن موجودة
  useEffect(() => {
    console.log('[ZXingBarcodeScanner] تهيئة المكون');
    
    // التحقق من الإذن وطلبه إذا لم يكن موجوداً
    const setupScanner = async () => {
      try {
        // طلب الإذن مباشرة عند تحميل المكون
        console.log('[ZXingBarcodeScanner] محاولة طلب إذن الكاميرا...');
        
        // عرض رسالة توضيحية للمستخدم
        await Toast.show({
          text: 'المطلوب إذن الكاميرا لمسح الباركود',
          duration: 'short'
        });
        
        // محاولة طلب الإذن مباشرة
        const granted = await requestPermission();
        
        if (!granted) {
          console.log('[ZXingBarcodeScanner] لم يتم منح الإذن');
          return;
        }
        
        // بدء المسح إذا كان لدينا إذن
        console.log('[ZXingBarcodeScanner] محاولة بدء المسح...');
        startScan().catch(e => 
          console.error('[ZXingBarcodeScanner] خطأ في بدء المسح:', e)
        );
      } catch (error) {
        console.error('[ZXingBarcodeScanner] خطأ في إعداد الماسح:', error);
      }
    };
    
    setupScanner();
    
    // التنظيف عند إلغاء تحميل المكون
    return () => {
      console.log('[ZXingBarcodeScanner] تنظيف المكون');
      
      stopScan().catch(e => 
        console.error('[ZXingBarcodeScanner] خطأ في إيقاف المسح عند التنظيف:', e)
      );
    };
  }, [hasPermission, startScan, stopScan, requestPermission]);

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
