
import React, { useEffect } from 'react';
import { ScannerLoading } from './ScannerLoading';
import { NoPermissionView } from './NoPermissionView';
import { ScannerView } from './ScannerView';
import { ScannerReadyView } from './ScannerReadyView';
import { DigitalCodeInput } from './DigitalCodeInput';

interface ScannerContainerProps {
  isManualEntry: boolean;
  hasScannerError: boolean;
  isLoading: boolean;
  hasPermission: boolean | null;
  isScanningActive: boolean;
  lastScannedCode: string | null;
  onScan: (code: string) => void;
  onClose: () => void;
  startScan: () => Promise<boolean>;
  stopScan: () => Promise<boolean>;
  handleManualEntry: () => void;
  handleManualCancel: () => void;
  handleRequestPermission: () => Promise<boolean>; // Make sure the type matches
  handleRetry: () => void;
}

export const ScannerContainer: React.FC<ScannerContainerProps> = ({
  isManualEntry,
  hasScannerError,
  isLoading,
  hasPermission,
  isScanningActive,
  lastScannedCode,
  onScan,
  onClose,
  startScan,
  stopScan,
  handleManualEntry,
  handleManualCancel,
  handleRequestPermission,
  handleRetry
}) => {
  // تطبيق حماية على عناصر الواجهة أثناء تشغيل الماسح
  useEffect(() => {
    // تسجيل العناصر التي نحتاج إلى حمايتها
    const elementsToProtect = document.querySelectorAll('header, footer, nav');
    
    // تطبيق فئات حماية على جميع العناصر المطلوبة
    elementsToProtect.forEach(element => {
      if (element instanceof HTMLElement) {
        element.classList.add('app-header');
        // تخزين الأنماط الأصلية لاستعادتها لاحقًا
        element.dataset.originalBg = element.style.background;
        element.dataset.originalOpacity = element.style.opacity;
      }
    });
    
    // تنظيف عند إلغاء تحميل المكون
    return () => {
      // استعادة الأنماط الأصلية بشكل تدريجي
      setTimeout(() => {
        document.querySelectorAll('.app-header').forEach(el => {
          if (el instanceof HTMLElement) {
            // استعادة الأنماط الأصلية إن وجدت، أو تعيين القيم الافتراضية
            el.style.background = 'white';
            el.style.backgroundColor = 'white';
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            // إزالة فئة الحماية
            el.classList.remove('app-header');
          }
        });
      }, 300);
    };
  }, []);
  
  if (isManualEntry) {
    return (
      <DigitalCodeInput 
        onSubmit={onScan}
        onCancel={handleManualCancel}
      />
    );
  }

  if (isLoading) {
    return <ScannerLoading onClose={onClose} />;
  }

  if (isScanningActive) {
    return (
      <ScannerView 
        isActive={true}
        cameraActive={true}
        hasError={hasScannerError}
        onStartScan={startScan}
        onStopScan={stopScan}
        onRetry={handleRetry}
        onClose={onClose}
      />
    );
  }
  
  if (hasPermission === false) {
    return (
      <NoPermissionView 
        onClose={onClose} 
        onRequestPermission={handleRequestPermission}
        onManualEntry={handleManualEntry}
      />
    );
  }
  
  return (
    <ScannerReadyView
      lastScannedCode={lastScannedCode}
      onStartScan={startScan}
      onClose={onClose}
      onManualEntry={handleManualEntry}
    />
  );
};
