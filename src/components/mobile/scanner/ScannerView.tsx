
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScannerFrame } from './components/ScannerFrame';
import { ScannerControls } from './components/ScannerControls';
import { ScannerStatusIndicator } from './components/ScannerStatusIndicator';
import { X, RefreshCw } from 'lucide-react';

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

  // عرض رسالة خطأ إذا كانت هناك مشكلة في الكاميرا
  if (hasError) {
    return (
      <div className="scanner-view-container relative h-full w-full bg-black/90 flex flex-col items-center justify-center">
        <div className="text-white text-center p-4">
          <div className="mb-4">
            <div className="bg-red-500/20 p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-2">
              <RefreshCw className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">حدث خطأ في الكاميرا</h3>
            <p className="text-sm text-gray-300 mb-4">تعذر تشغيل الكاميرا. يرجى التحقق من أذونات الكاميرا وإعادة المحاولة.</p>
          </div>
          <Button onClick={onRetry} className="bg-white text-black hover:bg-gray-200 w-full mb-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            إعادة المحاولة
          </Button>
          <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20 w-full">
            <X className="h-4 w-4 mr-2" />
            إغلاق
          </Button>
        </div>
      </div>
    );
  }
  
  // عرض رسالة انتظار إذا كانت الكاميرا غير نشطة
  if (!cameraActive) {
    return (
      <div className="scanner-view-container relative h-full w-full bg-black/90 flex flex-col items-center justify-center">
        <div className="text-white text-center p-4">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">جاري تفعيل الكاميرا</h3>
            <p className="text-sm text-gray-300 mb-4">يرجى الانتظار بينما يتم تجهيز الكاميرا...</p>
          </div>
          <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20 w-full">
            <X className="h-4 w-4 mr-2" />
            إغلاق
          </Button>
        </div>
      </div>
    );
  }

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
