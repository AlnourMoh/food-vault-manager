
import React, { useEffect } from 'react';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { ScannerErrorView } from './ScannerErrorView';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';

interface ScanProductContentProps {
  hasScannerError: boolean;
  showScanner: boolean;
  isProcessing: boolean;
  onRetry: () => void;
  onScan: (code: string) => void;
  onClose: () => void;
}

export const ScanProductContent = ({
  hasScannerError,
  showScanner,
  isProcessing,
  onRetry,
  onScan,
  onClose
}: ScanProductContentProps) => {
  // استخدام hook للتحقق من أذونات الكاميرا
  const { hasPermission, requestPermission } = useCameraPermissions();

  // التأكد من وجود إذن الكاميرا قبل عرض الماسح
  useEffect(() => {
    if (showScanner && hasPermission === false) {
      console.log('ScanProductContent: لا يوجد إذن للكاميرا، محاولة طلبه...');
      requestPermission().catch(error => {
        console.error('ScanProductContent: خطأ في طلب إذن الكاميرا:', error);
      });
    }
  }, [showScanner, hasPermission, requestPermission]);

  return (
    <div 
      className="h-[calc(100vh-120px)] relative flex items-center justify-center overflow-hidden"
      style={{
        position: 'relative'
      }}
    >
      {hasScannerError ? (
        <ScannerErrorView onRetry={onRetry} />
      ) : (
        showScanner && (
          <div className="scanner-container" style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1000, // تحديد مستوى z-index أعلى لضمان ظهور الماسح فوق أي عناصر أخرى
          }}>
            <ZXingBarcodeScanner
              onScan={onScan}
              onClose={onClose}
            />
          </div>
        )
      )}
    </div>
  );
};
