
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScannerFrame } from './components/ScannerFrame';
import { ScannerControls } from './components/ScannerControls';
import { ScannerStatusIndicator } from './components/ScannerStatusIndicator';
import { X, RefreshCw, Loader2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

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
  // تحسين: بدء المسح تلقائيًا بمجرد أن تكون الكاميرا نشطة
  useEffect(() => {
    // بدء المسح تلقائياً عندما تكون الكاميرا نشطة
    if (cameraActive && !isActive && !hasError) {
      console.log('ScannerView: الكاميرا نشطة الآن، جاري بدء المسح تلقائيًا...');
      
      // بدء المسح فورًا بدون تأخير
      onStartScan().catch(error => {
        console.error('ScannerView: خطأ في بدء المسح التلقائي:', error);
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
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </Button>
          <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20 w-full">
            <X className="h-4 w-4 ml-2" />
            إغلاق
          </Button>
        </div>
      </div>
    );
  }
  
  // عرض حالة انتظار تفعيل الكاميرا
  if (!cameraActive) {
    return (
      <div className="scanner-view-container relative h-full w-full bg-black/90 flex flex-col items-center justify-center">
        <div className="text-white text-center p-4">
          <div className="mb-6 flex flex-col items-center">
            <Spinner size="lg" className="border-white border-t-transparent mb-6" />
            <h3 className="text-xl font-semibold mb-3">جاري تفعيل الكاميرا</h3>
            <p className="text-sm text-gray-300">يرجى الانتظار بضع لحظات...</p>
          </div>
          <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20 w-full">
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
        </div>
      </div>
    );
  }

  // تم إزالة واجهة "بدء المسح" اليدوية، الكاميرا نشطة الآن والمسح سيبدأ تلقائيًا

  return (
    <div className="scanner-view-container relative h-full w-full">
      {/* إطار الماسح */}
      <ScannerFrame 
        isActive={isActive} 
        cameraActive={cameraActive} 
        hasError={hasError} 
      />
      
      {/* مؤشر حالة الماسح */}
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
