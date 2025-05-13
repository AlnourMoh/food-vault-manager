
import React, { useEffect, useState } from 'react';
import { useZXingBarcodeScanner } from '@/hooks/scanner/useZXingBarcodeScanner';
import { scannerUIService } from '@/services/scanner/ScannerUIService';
import { ScannerErrorBanner } from './scanner/components/ScannerErrorBanner';
import { Spinner } from '@/components/ui/spinner';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ onScan, onClose, autoStart = false }) => {
  const {
    isNativePlatform,
    hasPermission,
    scanActive,
    cameraActive,
    startScan,
    stopScan,
    checkAndRequestPermissions,
    isLoading
  } = useZXingBarcodeScanner(autoStart, onScan, onClose);

  const [isBrowserEnvironment, setIsBrowserEnvironment] = useState(false);
  
  // تهيئة عناصر الماسح
  useEffect(() => {
    // تحقق مما إذا كنا في بيئة متصفح وليس تطبيق جوال
    const checkEnvironment = () => {
      const inAppBrowser = navigator.userAgent.includes('wv') || navigator.userAgent.includes('Mobile');
      const isNative = isNativePlatform;
      
      // حدد إذا كان المستخدم في متصفح عادي وليس في تطبيق
      const isBrowser = !isNative && !inAppBrowser;
      console.log('ZXingBarcodeScanner: البيئة الحالية:', {
        isNative,
        inAppBrowser,
        isBrowser,
        userAgent: navigator.userAgent
      });
      
      setIsBrowserEnvironment(false); // نفترض أنه تطبيق جوال (غير متصفح)
    };
    
    checkEnvironment();
    
    // تنظيف عند إلغاء التثبيت
    return () => {
      stopScan();
    };
  }, [stopScan, isNativePlatform]);
  
  // عندما يتم التحميل وهناك أذونات، نبدأ المسح
  useEffect(() => {
    if (autoStart && hasPermission === true) {
      startScan();
    }
  }, [autoStart, hasPermission, startScan]);

  // بدء المسح يدوياً
  const handleStartScan = async () => {
    try {
      // إعداد واجهة المستخدم أولاً
      scannerUIService.setupUIForScanning();
      
      // بدء المسح
      await startScan();
    } catch (error) {
      console.error('ZXingBarcodeScanner: خطأ في بدء المسح:', error);
    }
  };
  
  // إيقاف المسح يدوياً
  const handleStopScan = async () => {
    try {
      await stopScan();
      scannerUIService.restoreUIAfterScanning();
      if (onClose) onClose();
    } catch (error) {
      console.error('ZXingBarcodeScanner: خطأ في إيقاف المسح:', error);
    }
  };

  // طلب الأذونات المطلوبة
  const handleRequestPermissions = async () => {
    await checkAndRequestPermissions();
  };
  
  if (isBrowserEnvironment) {
    // إذا كنا في متصفح عادي، لا يمكن استخدام الماسح
    return (
      <div className="p-4 bg-white border rounded-lg shadow">
        <ScannerErrorBanner 
          message="المسح غير متاح في المتصفح" 
          subMessage="يرجى استخدام تطبيق الجوال للقيام بعمليات المسح"
        />
        <div className="mt-4 flex justify-center">
          <button
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
            onClick={onClose}
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  // إذا كان هناك تحميل، نظهر مؤشر التحميل
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Spinner size="lg" className="mb-4" />
        <p>جاري تهيئة الماسح...</p>
      </div>
    );
  }

  // إذا لم تكن هناك أذونات، نظهر زر طلب الأذونات
  if (hasPermission === false) {
    return (
      <div className="p-4 bg-white border rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">إذن الكاميرا مطلوب</h3>
        <p className="mb-4">يرجى منح إذن الكاميرا لاستخدام الماسح الضوئي.</p>
        <div className="flex justify-center gap-2">
          <button
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
            onClick={handleRequestPermissions}
          >
            طلب الإذن
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            إلغاء
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`scanner-container ${scanActive ? 'full-screen-scanner' : 'p-4'}`}>
      {!scanActive ? (
        <div className="p-4 bg-white border rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">الماسح الضوئي</h3>
          <p className="mb-4">اضغط على الزر أدناه لبدء المسح.</p>
          <div className="flex justify-center gap-2">
            <button
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
              onClick={handleStartScan}
            >
              بدء المسح
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="p-4 flex justify-end">
            <button
              className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30"
              onClick={handleStopScan}
            >
              <span className="sr-only">إغلاق</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-square">
              <div className="absolute inset-0 border-2 border-white/50 rounded-lg"></div>
              <div className="animate-scanner-line w-full h-0.5 bg-primary absolute left-0 right-0"></div>
              {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <Spinner size="lg" className="text-primary" />
                </div>
              )}
            </div>
          </div>
          <div className="p-4 text-center text-white">
            <p>وجه الكاميرا نحو الباركود للمسح</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZXingBarcodeScanner;
