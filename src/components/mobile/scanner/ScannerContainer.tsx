
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
  startScan: () => void;
  stopScan: () => void;
  handleManualEntry: () => void;
  handleManualCancel: () => void;
  handleRequestPermission: () => void;
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
  // ضمان أن عناصر الهيدر والفوتر محمية أثناء عمل الماسح
  useEffect(() => {
    // تطبيق فئات حماية على الهيدر والفوتر
    document.querySelectorAll('header, footer, nav').forEach(element => {
      if (element instanceof HTMLElement) {
        element.classList.add('app-header');
      }
    });
    
    // تنظيف عند إلغاء المكون
    return () => {
      // إعادة تعيين أنماط الهيدر والفوتر بشكل قسري
      setTimeout(() => {
        document.querySelectorAll('header, .app-header').forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.background = 'white';
            el.style.backgroundColor = 'white';
            el.style.opacity = '1';
            el.style.visibility = 'visible';
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
    return <ScannerLoading />;
  }

  return (
    <div className="fixed inset-0 z-50">
      {isScanningActive ? (
        <ScannerView 
          onStop={stopScan} 
          hasPermissionError={hasPermission === false}
          onRequestPermission={handleRequestPermission}
          onManualEntry={handleManualEntry}
        />
      ) : (
        hasPermission === false ? (
          <NoPermissionView 
            onClose={onClose} 
            onRequestPermission={handleRequestPermission}
            onManualEntry={handleManualEntry}
          />
        ) : (
          <ScannerReadyView
            lastScannedCode={lastScannedCode}
            onStartScan={startScan}
            onClose={onClose}
            onManualEntry={handleManualEntry}
          />
        )
      )}
    </div>
  );
};
