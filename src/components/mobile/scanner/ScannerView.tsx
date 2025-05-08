
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScannerFrame } from './components/ScannerFrame';
import { ScannerControls } from './components/ScannerControls';
import { ScannerStatusIndicator } from './components/ScannerStatusIndicator';

interface ScannerViewProps {
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
  onStartScan: () => Promise<boolean>;
  onStopScan: () => Promise<boolean>;
  onRetry: () => void;
  onClose: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  isActive,
  cameraActive,
  hasError,
  onStartScan,
  onStopScan,
  onRetry,
  onClose
}) => {
  // عند تحميل المكون، نبدأ المسح تلقائيًا إذا كانت الكاميرا نشطة
  useEffect(() => {
    if (cameraActive && !isActive && !hasError) {
      console.log('الكاميرا نشطة، بدء المسح تلقائيًا...');
      onStartScan().catch(error => {
        console.error('خطأ في بدء المسح التلقائي:', error);
      });
    }
  }, [cameraActive, isActive, hasError, onStartScan]);

  return (
    <div className="scanner-view-container relative h-full w-full">
      {/* إطار الماسح */}
      <ScannerFrame 
        isActive={isActive} 
        cameraActive={cameraActive} 
        hasError={hasError} 
      />
      
      {/* مؤشر حالة الماسح - تم إضافته لعرض حالة الكاميرا */}
      <ScannerStatusIndicator 
        isActive={isActive} 
        cameraActive={cameraActive}
        hasError={hasError}
      />
      
      {/* عناصر التحكم في الماسح */}
      <ScannerControls 
        isActive={isActive}
        cameraActive={cameraActive}
        hasError={hasError}
        onStartScan={onStartScan}
        onStopScan={onStopScan}
        onRetry={onRetry}
        onClose={onClose}
      />
      
      {/* زر إغلاق للحالات الطارئة */}
      <Button
        onClick={onClose}
        className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 size-10"
        variant="ghost"
        size="icon"
      >
        <span className="sr-only">إغلاق</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Button>
    </div>
  );
};
