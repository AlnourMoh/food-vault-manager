
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScannerFrame } from './components/ScannerFrame';
import { ScannerControls } from './components/ScannerControls';
import { ScannerStatusIndicator } from './components/ScannerStatusIndicator';
import { X, RefreshCw, Loader2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { ActiveScannerView } from './components/ActiveScannerView';

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
  // إضافة مرجع للتأكد من أن المكون ما زال مثبتًا
  const isMounted = useRef(true);
  // مرجع لتتبع محاولات بدء المسح
  const startAttempts = useRef(0);
  // منع الإغلاق التلقائي
  const scanTimeoutRef = useRef<number | null>(null);

  // عند تحميل المكون، نبدأ المسح تلقائيًا إذا كانت الكاميرا نشطة
  useEffect(() => {
    const initScan = async () => {
      if (cameraActive && !isActive && !hasError && isMounted.current) {
        console.log('ScannerView: الكاميرا نشطة الآن، جاري بدء المسح تلقائيًا...');
        
        // تتبع عدد المحاولات لمنع الحلقات اللانهائية
        startAttempts.current += 1;
        
        if (startAttempts.current <= 3) {
          try {
            const started = await onStartScan();
            console.log(`ScannerView: نتيجة بدء المسح التلقائي: ${started ? 'نجاح' : 'فشل'}`);
            
            // إذا فشل المسح، حاول مرة أخرى بعد فترة
            if (!started && isMounted.current && startAttempts.current < 3) {
              console.log('ScannerView: فشل المسح، محاولة أخرى بعد تأخير');
              
              scanTimeoutRef.current = window.setTimeout(() => {
                if (isMounted.current) {
                  initScan();
                }
              }, 1500);
            }
          } catch (error) {
            console.error('ScannerView: خطأ في بدء المسح التلقائي:', error);
            
            // محاولة أخرى بعد خطأ
            if (isMounted.current && startAttempts.current < 3) {
              scanTimeoutRef.current = window.setTimeout(() => {
                if (isMounted.current) {
                  initScan();
                }
              }, 2000);
            }
          }
        }
      }
    };
    
    // تأخير قصير قبل بدء المسح لضمان جاهزية الواجهة
    const timer = setTimeout(initScan, 800);
    
    return () => {
      clearTimeout(timer);
      if (scanTimeoutRef.current !== null) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }
    };
  }, [cameraActive, isActive, hasError, onStartScan]);

  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log('ScannerView تم إلغاء تحميل المكون');
      isMounted.current = false;
      
      // تنظيف أي مهلات زمنية
      if (scanTimeoutRef.current !== null) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }
    };
  }, []);

  // إضافة تسجيل للمكون للتشخيص
  useEffect(() => {
    console.log('ScannerView حالة:', { isActive, cameraActive, hasError });
  }, [isActive, cameraActive, hasError]);

  // عرض رسالة خطأ إذا كانت هناك مشكلة في الكاميرا
  if (hasError) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-full mb-6">
          <X className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">خطأ في الكاميرا</h2>
        <p className="text-white/70 mb-8 text-center">
          حدث خطأ أثناء محاولة تفعيل الكاميرا. يرجى التحقق من أذونات الكاميرا وإعادة المحاولة.
        </p>
        <div className="space-y-3 w-full max-w-md">
          <Button 
            onClick={onRetry}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </Button>
          <Button 
            onClick={onClose} 
            variant="outline"
            className="w-full text-white border-white/30 hover:bg-white/10"
          >
            <X className="h-4 w-4 ml-2" />
            إغلاق
          </Button>
        </div>
      </div>
    );
  }

  // عرض شاشة التحميل إذا كانت الكاميرا غير نشطة
  if (!cameraActive) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="text-white mt-4">جاري تنشيط الكاميرا...</p>
        <Button 
          onClick={onClose}
          variant="ghost"
          className="absolute bottom-6 text-white"
        >
          <X className="h-4 w-4 ml-2" />
          إلغاء
        </Button>
      </div>
    );
  }

  // عرض حالة الماسح النشطة
  return <ActiveScannerView 
    cameraActive={cameraActive} 
    isScanningActive={isActive} 
    onClose={onClose} 
  />;
};
