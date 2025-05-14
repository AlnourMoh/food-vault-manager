
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
  handleRequestPermission: () => Promise<boolean>;
  handleRetry: () => void;
  cameraActive?: boolean;
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
  handleRetry,
  cameraActive = false
}) => {
  // تطبيق أنماط خاصة على عناصر الواجهة أثناء تشغيل الماسح
  useEffect(() => {
    // إضافة فئة عامة للجسم للتحكم في المظهر العام
    document.body.classList.add('scanner-active');
    
    // حفظ الحالة الأصلية للعناصر الرئيسية
    const elementsToProtect = document.querySelectorAll('header:not(.scanner-header), footer:not(.scanner-footer), nav:not(.scanner-nav)');
    
    // تطبيق فئات حماية على جميع العناصر المطلوبة
    elementsToProtect.forEach(element => {
      if (element instanceof HTMLElement) {
        element.classList.add('app-header');
        
        // حفظ الأنماط الأصلية لاستعادتها لاحقًا
        if (!element.dataset.originalBg) {
          element.dataset.originalBg = element.style.background || '';
          element.dataset.originalOpacity = element.style.opacity || '1';
          element.dataset.originalVisibility = element.style.visibility || 'visible';
        }
        
        // تطبيق أنماط الإخفاء
        element.style.background = 'transparent';
        element.style.opacity = '0';
        element.style.visibility = 'hidden';
      }
    });
    
    // تنظيف عند إلغاء تحميل المكون
    return () => {
      // إزالة الفئة العامة من الجسم
      document.body.classList.remove('scanner-active');
      
      // استعادة الأنماط الأصلية بشكل تدريجي
      setTimeout(() => {
        document.querySelectorAll('.app-header').forEach(el => {
          if (el instanceof HTMLElement) {
            // استعادة الأنماط الأصلية إذا كانت محفوظة
            if (el.dataset.originalBg) {
              el.style.background = el.dataset.originalBg;
              el.style.opacity = el.dataset.originalOpacity || '1';
              el.style.visibility = el.dataset.originalVisibility || 'visible';
              
              // مسح البيانات المحفوظة
              delete el.dataset.originalBg;
              delete el.dataset.originalOpacity;
              delete el.dataset.originalVisibility;
            } else {
              // تطبيق أنماط افتراضية إذا لم تكن هناك قيم محفوظة
              el.style.background = 'white';
              el.style.backgroundColor = 'white';
              el.style.opacity = '1';
              el.style.visibility = 'visible';
            }
            
            // إزالة فئة الحماية
            el.classList.remove('app-header');
          }
        });
      }, 300);
    };
  }, []);
  
  // تحديد المكون المناسب للعرض بناءً على الحالة
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

  if (isScanningActive || cameraActive) {
    return (
      <ScannerView 
        isActive={isScanningActive}
        cameraActive={cameraActive || false}
        hasError={hasScannerError}
        onStartScan={startScan}
        onStopScan={stopScan}
        onRetry={handleRetry}
        onClose={onClose}
        onManualEntry={handleManualEntry}
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
