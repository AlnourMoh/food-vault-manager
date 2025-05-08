
import React, { useEffect, useRef, useState } from 'react';
import { useZXingScanner } from '@/hooks/scanner/useZXingScanner';
import { ScannerContainer } from './scanner/ScannerContainer';
import { Toast } from '@capacitor/toast';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import '@/styles/zxing-scanner.css';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // استخدام hook الماسح الضوئي مع تفعيل البدء التلقائي
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
  } = useZXingScanner({ 
    onScan, 
    onClose,
    autoStart: true // تفعيل البدء التلقائي للمسح
  });
  
  // تهيئة المكون مع بدء المسح فورًا بعد التحقق من الأذونات
  useEffect(() => {
    console.log('[ZXingBarcodeScanner] تهيئة المكون وبدء المسح الفوري');
    
    // إضافة التأثير البصري للماسح
    document.body.classList.add('zxing-scanning');
    
    // التحقق من الإذن وطلبه إذا لم يكن موجوداً
    const setupScannerAndStartImmediately = async () => {
      try {
        setIsInitializing(true);
        
        // محاولة إعادة تعيين حالة التطبيق المسجلة في Android
        if (Capacitor.getPlatform() === 'android') {
          try {
            await BarcodeScanner.enableTorch(false);
          } catch (e) {
            // تجاهل الأخطاء هنا
          }
          
          try {
            await BarcodeScanner.stopScan();
          } catch (e) {
            // تجاهل الأخطاء هنا
          }
        }
        
        // طلب الإذن مباشرة عند تحميل المكون
        console.log('[ZXingBarcodeScanner] محاولة طلب إذن الكاميرا وبدء المسح فورًا...');
        
        // التحقق المباشر من وجود الأذونات
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('[ZXingBarcodeScanner] التحقق من وجود MLKit...');
          
          // التحقق من حالة الإذن الحالية
          const { camera } = await BarcodeScanner.checkPermissions();
          console.log('[ZXingBarcodeScanner] حالة إذن الكاميرا:', camera);
            
          if (camera === 'granted') {
            console.log('[ZXingBarcodeScanner] الإذن ممنوح مسبقاً، بدء المسح فورًا');
            startScan();
            setIsInitializing(false);
            return;
          }
          
          // طلب الإذن إذا لم يكن موجودًا
          console.log('[ZXingBarcodeScanner] طلب الإذن وبدء المسح');
          const permissionResult = await BarcodeScanner.requestPermissions();
          
          if (permissionResult.camera === 'granted') {
            console.log('[ZXingBarcodeScanner] تم منح الإذن، بدء المسح فورًا');
            startScan();
            setIsInitializing(false);
            return;
          } else {
            // محاولة استخدام scannerPermissionService إذا فشلت الطريقة المباشرة
            const serviceGranted = await scannerPermissionService.requestPermission();
            
            if (serviceGranted) {
              console.log('[ZXingBarcodeScanner] تم منح الإذن من الخدمة، بدء المسح');
              startScan();
              setIsInitializing(false);
              return;
            } else {
              await Toast.show({
                text: 'لم يتم منح إذن الكاميرا. برجاء تمكينه من إعدادات الهاتف.',
                duration: 'long'
              });
              
              setTimeout(async () => {
                await scannerPermissionService.openAppSettings();
              }, 1500);
            }
          }
        } else {
          // استخدام الطريقة العادية لطلب الإذن إذا لم يكن MLKit متاحًا
          const granted = await requestPermission();
          
          if (granted) {
            console.log('[ZXingBarcodeScanner] تم منح الإذن بالطريقة العادية، بدء المسح');
            startScan();
          } else {
            await Toast.show({
              text: 'لم يتم منح إذن الكاميرا. برجاء تمكينه من إعدادات الهاتف.',
              duration: 'long'
            });
            
            setTimeout(async () => {
              await scannerPermissionService.openAppSettings();
            }, 1500);
          }
        }
      } catch (error) {
        console.error('[ZXingBarcodeScanner] خطأ في إعداد الماسح:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    setupScannerAndStartImmediately();
    
    // التنظيف عند إلغاء تحميل المكون
    return () => {
      console.log('[ZXingBarcodeScanner] تنظيف المكون');
      
      // إزالة التأثير البصري
      document.body.classList.remove('zxing-scanning');
      
      stopScan().catch(e => 
        console.error('[ZXingBarcodeScanner] خطأ في إيقاف المسح عند التنظيف:', e)
      );
    };
  }, [startScan, stopScan, requestPermission]);

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
        isLoading={isLoading || isInitializing}
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
