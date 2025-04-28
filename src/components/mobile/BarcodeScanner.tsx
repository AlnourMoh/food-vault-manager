
import React, { useEffect, useRef } from 'react';
import { useScannerInitialization } from './scanner/hooks/useScannerInitialization';
import { useScannerControls } from './scanner/hooks/useScannerControls';
import { ScannerContainer } from './scanner/ScannerContainer';
import { useScannerUI } from '@/hooks/scanner/useScannerUI';
import { BarcodeScanner as MLKitBarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import styles from './scanner/scanner.module.css';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const addedElements = useRef<HTMLElement[]>([]);
  const isActive = useRef(false);
  
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
    handleRetry
  } = useScannerControls({ 
    onScan: (code) => {
      console.log('[BarcodeScanner] تم المسح بنجاح:', code);
      onScan(code);
    }, 
    onClose: () => {
      console.log('[BarcodeScanner] تم الإغلاق');
      stopScan();
      onClose();
    } 
  });

  // تحسين تهيئة وتنظيف المكون بنهج أكثر احتواءً
  useEffect(() => {
    console.log('[BarcodeScanner] تهيئة المكون وفتح الكاميرا...');
    
    if (isActive.current) {
      console.log('[BarcodeScanner] المكون نشط بالفعل، تخطي التهيئة');
      return;
    }
    
    isActive.current = true;
    
    // إضافة فئات محددة للهيدر والفوتر لحمايتها
    const addClassToElements = (selector: string, className: string) => {
      document.querySelectorAll(selector).forEach(element => {
        if (element instanceof HTMLElement) {
          element.classList.add(className);
          addedElements.current.push(element);
        }
      });
    };
    
    // تصنيف عناصر التنقل والهيدر والفوتر بشكل صحيح
    addClassToElements('header', 'app-header');
    addClassToElements('nav', 'app-footer');
    addClassToElements('footer', 'app-footer');
    
    // أسلوب محسّن للاحتواء - عزل عناصر الماسح
    const scannerRoot = document.createElement('div');
    scannerRoot.id = 'scanner-root';
    scannerRoot.className = styles.scannerRoot;
    document.body.appendChild(scannerRoot);
    addedElements.current.push(scannerRoot);
    
    // تنشيط الماسح وفتح الكاميرا
    const initScanner = async () => {
      // 1. أولاً، إعداد خلفية العرض
      await setupScannerBackground();
      
      // 2. ثم تهيئة كاميرا MLKit
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const { supported } = await MLKitBarcodeScanner.isSupported();
          console.log('[BarcodeScanner] هل MLKit مدعوم؟', supported);
          
          if (supported) {
            const { camera } = await MLKitBarcodeScanner.requestPermissions();
            console.log('[BarcodeScanner] نتيجة إذن الكاميرا:', camera);
            
            if (camera === 'granted') {
              // بدء المسح بعد الحصول على الإذن
              startScan();
            } else {
              console.warn('[BarcodeScanner] لم يتم منح إذن الكاميرا');
              handleRetry();
            }
          } else {
            // تشغيل الماسح حتى لو لم يكن MLKit مدعوماً
            startScan();
          }
        } catch (error) {
          console.error('[BarcodeScanner] خطأ في التحقق من دعم MLKit:', error);
          startScan(); // محاولة بدء المسح على أي حال
        }
      } else {
        console.log('[BarcodeScanner] MLKit غير متاح، استخدام آلية بديلة');
        startScan();
      }
    };
    
    initScanner();
    
    // التنظيف عند إلغاء المكون - تحسين عملية التنظيف
    return () => {
      console.log('[BarcodeScanner] تنظيف المكون...');
      isActive.current = false;
      
      try {
        // 1. إيقاف المسح أولاً
        stopScan();
        
        // 2. تنظيف الخلفية والأنماط
        cleanupScannerBackground();
        
        // 3. إزالة العناصر المضافة
        for (const element of addedElements.current) {
          if (element && element.parentNode) {
            if (element.classList.contains('app-header') || 
                element.classList.contains('app-footer')) {
              // للهيدر والفوتر نحتفظ بالعناصر ولكن نزيل الفئة فقط
              element.classList.remove('scanner-active', 'scanner-cleanup-active');
            } else {
              // للعناصر الأخرى المرتبطة بالماسح نزيلها تماماً
              element.parentNode.removeChild(element);
            }
          }
        }
        addedElements.current = [];
        
        // 4. محاولة إيقاف MLKit بشكل صريح
        if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
          MLKitBarcodeScanner.stopScan().catch(e => 
            console.warn('[BarcodeScanner] خطأ عند إيقاف المسح في التنظيف:', e)
          );
        }
        
        // 5. محاولة نهائية لإصلاح الهيدر والفوتر بشكل قسري
        setTimeout(() => {
          document.querySelectorAll('.app-header, header').forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.background = 'white';
              el.style.backgroundColor = 'white';
              el.style.visibility = 'visible';
              el.style.opacity = '1';
              el.style.zIndex = '1000';
              el.style.position = 'relative';
              el.style.display = 'flex';
            }
          });
          
          document.querySelectorAll('.app-footer, footer, nav').forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.background = 'white';
              el.style.backgroundColor = 'white';
              el.style.visibility = 'visible';
              el.style.opacity = '1';
              el.style.zIndex = '1000';
            }
          });
          
          document.body.classList.remove(styles.scannerActive, 'scanner-mode');
        }, 500);
      } catch (error) {
        console.error('[BarcodeScanner] خطأ أثناء التنظيف:', error);
      }
    };
  }, []);

  return (
    <div 
      ref={scannerContainerRef}
      className="fixed inset-0 z-[9999] scanner-container" 
      style={{
        background: 'transparent',
        backgroundColor: 'transparent',
        visibility: 'visible'
      }}
      data-testid="barcode-scanner-container"
    >
      <ScannerContainer
        isManualEntry={isManualEntry}
        hasScannerError={hasScannerError}
        isLoading={false}
        hasPermission={true}
        isScanningActive={true}
        lastScannedCode={lastScannedCode}
        onScan={onScan}
        onClose={onClose}
        startScan={startScan}
        stopScan={stopScan}
        handleManualEntry={handleManualEntry}
        handleManualCancel={handleManualCancel}
        handleRequestPermission={startScan}
        handleRetry={handleRetry}
      />
    </div>
  );
};

export default BarcodeScanner;
