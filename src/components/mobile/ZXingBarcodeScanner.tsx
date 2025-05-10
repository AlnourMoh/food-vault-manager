
import React, { useCallback, useEffect, useState } from 'react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { scannerCameraService } from '@/services/scanner/ScannerCameraService';
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { ScannerErrorHandling } from './scanner/ScannerErrorHandling';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({
  onScan,
  onClose,
  autoStart = false
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [hasCameraError, setHasCameraError] = useState(false);
  const [initAttempts, setInitAttempts] = useState(0);
  const maxAttempts = 3;

  // إعداد الماسح وبدء المسح
  const setupScanner = useCallback(async () => {
    try {
      console.log('ZXingBarcodeScanner: إعداد الماسح الضوئي');
      const permissionGranted = await scannerPermissionService.checkPermission();
      
      if (!permissionGranted) {
        console.log('ZXingBarcodeScanner: طلب إذن الكاميرا');
        const granted = await scannerPermissionService.requestPermission();
        setHasPermission(granted);
        
        if (!granted) {
          console.log('ZXingBarcodeScanner: تم رفض إذن الكاميرا');
          return;
        }
      } else {
        setHasPermission(true);
      }
      
      // بمجرد حصولنا على الإذن، نهيئ الكاميرا
      await initializeCamera();
      
    } catch (error) {
      console.error('ZXingBarcodeScanner: خطأ في إعداد الماسح:', error);
      setHasCameraError(true);
    }
  }, []);

  // تهيئة الكاميرا
  const initializeCamera = async () => {
    try {
      // زيادة عدد محاولات التهيئة
      setInitAttempts(prev => prev + 1);
      const attempts = initAttempts + 1;
      
      console.log(`ZXingBarcodeScanner: تهيئة الكاميرا (محاولة ${attempts}/${maxAttempts})`);
      
      if (attempts > maxAttempts) {
        console.error('ZXingBarcodeScanner: تجاوز الحد الأقصى من محاولات التهيئة');
        setHasCameraError(true);
        return false;
      }
      
      setIsInitialized(false);
      setHasCameraError(false);
      
      // تحضير الكاميرا
      const cameraReady = await scannerCameraService.prepareCamera();
      
      if (!cameraReady) {
        console.error('ZXingBarcodeScanner: فشلت تهيئة الكاميرا');
        setHasCameraError(true);
        return false;
      }
      
      // تم تهيئة الكاميرا بنجاح
      setIsInitialized(true);
      console.log('ZXingBarcodeScanner: تمت تهيئة الكاميرا بنجاح');
      
      if (autoStart) {
        startScan();
      }
      
      return true;
    } catch (error) {
      console.error('ZXingBarcodeScanner: خطأ في تهيئة الكاميرا:', error);
      setHasCameraError(true);
      return false;
    }
  };

  // بدء المسح
  const startScan = useCallback(async () => {
    try {
      console.log('ZXingBarcodeScanner: بدء المسح');
      
      if (!isInitialized) {
        console.log('ZXingBarcodeScanner: الكاميرا غير مهيأة، محاولة التهيئة...');
        const initialized = await initializeCamera();
        if (!initialized) return;
      }
      
      setIsScanningActive(true);
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // إخفاء خلفية التطبيق في الكاميرا (لتجنب عناصر واجهة مداخلة)
        await BarcodeScanner.hideBackground();
        
        const result = await BarcodeScanner.scan(scannerCameraService.getScanFormatOptions());
        console.log('ZXingBarcodeScanner: نتيجة المسح:', result);
        
        // إظهار الخلفية مرة أخرى
        await BarcodeScanner.showBackground();
        
        if (result.barcodes && result.barcodes.length > 0) {
          const barcodeData = result.barcodes[0].rawValue;
          if (barcodeData) {
            onScan(barcodeData);
          }
        }
      } else {
        // في بيئة الويب، نستخدم محاكاة للمسح
        console.log('ZXingBarcodeScanner: محاكاة المسح في بيئة الويب');
        
        // بعد 2 ثوانية، نعيد نتيجة محاكاة
        setTimeout(() => {
          const mockBarcode = `TEST-${Math.floor(Math.random() * 1000000)}`;
          onScan(mockBarcode);
        }, 2000);
      }
    } catch (error) {
      console.error('ZXingBarcodeScanner: خطأ في بدء المسح:', error);
      setHasCameraError(true);
      await Toast.show({
        text: 'حدث خطأ في المسح',
        duration: 'short'
      });
    } finally {
      setIsScanningActive(false);
    }
  }, [isInitialized, onScan]);

  // إعادة المحاولة بعد الخطأ
  const handleRetry = useCallback(async () => {
    setHasCameraError(false);
    setInitAttempts(0);
    await scannerCameraService.cleanupCamera();
    await initializeCamera();
  }, []);

  // تنظيف الموارد عند إغلاق المكون
  useEffect(() => {
    setupScanner();
    
    return () => {
      console.log('ZXingBarcodeScanner: تنظيف الموارد عند الإغلاق');
      if (Capacitor.isNativePlatform()) {
        scannerCameraService.cleanupCamera().catch(error => {
          console.error('ZXingBarcodeScanner: خطأ في تنظيف موارد الكاميرا:', error);
        });
      }
    };
  }, [setupScanner]);
  
  // عرض رسالة خطأ إذا كان هناك مشكلة
  if (hasCameraError) {
    return (
      <ScannerErrorHandling 
        onRetry={handleRetry}
        onClose={onClose}
      />
    );
  }

  // عرض شاشة الانتظار أثناء تهيئة الكاميرا
  if (!isInitialized || !hasPermission) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
        <div className="text-white text-center p-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">جاري تحضير الكاميرا...</h2>
          <p className="text-sm opacity-70 mb-6">يرجى الانتظار قليلاً</p>
          
          {initAttempts > 1 && (
            <p className="text-xs opacity-50 mb-2">محاولة {initAttempts}/{maxAttempts}</p>
          )}
          
          <button 
            onClick={onClose}
            className="bg-white/20 text-white px-4 py-2 rounded hover:bg-white/30"
          >
            إلغاء
          </button>
        </div>
      </div>
    );
  }

  // عرض واجهة المسح الرئيسية
  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute inset-0 z-10">
        {/* عنصر مخصص لإظهار الشريط الليزري للمسح */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 animate-pulse"></div>
        
        {/* إطار المسح */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white rounded-lg"></div>
      </div>
      
      {/* التعليمات */}
      <div className="absolute top-10 left-0 right-0 text-center text-white">
        <h2 className="text-xl font-bold mb-1">قم بتوجيه الكاميرا نحو الباركود</h2>
        <p className="text-sm opacity-70">سيتم التعرف عليه تلقائياً</p>
      </div>
      
      {/* زر الإغلاق */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="sr-only">إغلاق</span>
      </button>
      
      {/* زر بدء المسح (إذا لم يكن تلقائياً) */}
      {!autoStart && !isScanningActive && (
        <button
          onClick={startScan}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-bold"
        >
          بدء المسح
        </button>
      )}
      
      {/* حالة المسح النشطة */}
      {isScanningActive && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white mx-auto mb-2"></div>
          <p>جاري المسح...</p>
        </div>
      )}
    </div>
  );
};

export default ZXingBarcodeScanner;
