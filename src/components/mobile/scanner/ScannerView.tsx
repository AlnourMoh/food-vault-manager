
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScannerFrame } from './components/ScannerFrame';
import { ScannerControls } from './components/ScannerControls';
import { ScannerStatusIndicator } from './components/ScannerStatusIndicator';
import { X } from 'lucide-react';

interface ScannerViewProps {
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
  onStartScan: () => Promise<boolean>;
  onStopScan: () => Promise<boolean>;
  onRetry: () => void;
  onClose: () => void;
  onToggleFlash?: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  isActive,
  cameraActive,
  hasError,
  onStartScan,
  onStopScan,
  onRetry,
  onClose,
  onToggleFlash
}) => {
  // عند تحميل المكون، نبدأ المسح تلقائيًا إذا كانت الكاميرا نشطة
  useEffect(() => {
    if (cameraActive && !isActive && !hasError) {
      console.log('الكاميرا نشطة الآن، جاري محاولة بدء المسح تلقائيًا...');
      onStartScan().catch(error => {
        console.error('خطأ في بدء المسح التلقائي:', error);
      });
    }
  }, [cameraActive, isActive, hasError, onStartScan]);

  // إضافة تسجيل للمكون للتشخيص
  useEffect(() => {
    console.log('ScannerView حالة:', { isActive, cameraActive, hasError });
    
    return () => {
      console.log('ScannerView تم إلغاء تحميل المكون');
    };
  }, [isActive, cameraActive, hasError]);

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
        onToggleFlash={onToggleFlash}
      />
      
      {/* زر إغلاق للحالات الطارئة */}
      <Button
        onClick={onClose}
        className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 size-10"
        variant="ghost"
        size="icon"
      >
        <span className="sr-only">إغلاق</span>
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};
