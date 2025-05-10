
import React, { useEffect, useState } from 'react';
import { useZXingBarcodeScanner } from '@/hooks/scanner/useZXingBarcodeScanner';
import { ScannerLoadingView } from './scanner/components/ScannerLoadingView';
import { PermissionRequestView } from './scanner/components/PermissionRequestView';
import { ScannerErrorView } from './scanner/components/ScannerErrorView';
import { ActiveScannerView } from './scanner/components/ActiveScannerView';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { NoPermissionView } from './scanner/NoPermissionView';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ 
  onScan, 
  onClose, 
  autoStart = true 
}) => {
  const [debugMode, setDebugMode] = useState(false);
  
  const {
    isLoading,
    hasPermission,
    cameraActive,
    isScanningActive,
    scannerError,
    requestPermission,
    handleRetry,
    openAppSettings,
    startScan
  } = useZXingBarcodeScanner({ onScan, onClose, autoStart });

  // إضافة سجل تشخيصي لتتبع حالة المكون
  useEffect(() => {
    const logDiagnostic = async () => {
      try {
        const platform = Capacitor.getPlatform();
        const isNative = Capacitor.isNativePlatform();
        const message = `حالة الماسح الضوئي - المنصة: ${platform}, أصلي: ${isNative ? 'نعم' : 'لا'}, الإذن: ${hasPermission === true ? 'ممنوح' : hasPermission === false ? 'مرفوض' : 'غير معروف'}, الكاميرا نشطة: ${cameraActive ? 'نعم' : 'لا'}, المسح نشط: ${isScanningActive ? 'نعم' : 'لا'}`;
        
        console.log(message);
        
        if (isNative) {
          await Toast.show({
            text: message,
            duration: 'long'
          });
        }
      } catch (error) {
        console.error("خطأ في سجل التشخيص:", error);
      }
    };
    
    logDiagnostic();
  }, [hasPermission, cameraActive, isScanningActive]);
  
  // تجربة تفعيل الكاميرا بشكل مباشر بعد الحصول على الإذن
  useEffect(() => {
    const activateCamera = async () => {
      if (hasPermission === true && autoStart && !cameraActive) {
        console.log("ZXingBarcodeScanner: تم منح الإذن، تجربة تفعيل الكاميرا مباشرة");
        try {
          // فرض تأخير قصير قبل تفعيل الكاميرا لضمان استقرار حالة الإذن
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // تجربة بدء المسح مباشرة
          const started = await startScan();
          console.log("ZXingBarcodeScanner: نتيجة محاولة تفعيل الكاميرا:", started);
          
          if (!started) {
            console.warn("ZXingBarcodeScanner: فشل تفعيل الكاميرا، محاولة مرة أخرى بعد تأخير");
            await new Promise(resolve => setTimeout(resolve, 1000));
            await startScan();
          }
        } catch (error) {
          console.error("ZXingBarcodeScanner: خطأ في تفعيل الكاميرا:", error);
        }
      }
    };
    
    activateCamera();
  }, [hasPermission, autoStart, cameraActive, startScan]);
  
  // محاولة طلب الأذونات عند بدء التشغيل
  useEffect(() => {
    if (hasPermission === false && autoStart) {
      console.log("محاولة طلب الأذونات عند بدء التشغيل");
      
      // استخدام خدمة الأذونات المحسّنة
      const attemptPermission = async () => {
        try {
          const result = await scannerPermissionService.requestPermission();
          return result;
        } catch (error) {
          console.error("خطأ في طلب الإذن التلقائي:", error);
          return false;
        }
      };
      
      attemptPermission();
    }
  }, [hasPermission, autoStart]);

  // تبديل وضع التصحيح
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };
  
  // عرض شاشة التحميل
  if (isLoading) {
    return <ScannerLoadingView onClose={onClose} />;
  }
  
  // عرض شاشة طلب الإذن
  if (hasPermission === false) {
    return <NoPermissionView 
      onRequestPermission={async () => {
        const granted = await requestPermission();
        console.log("نتيجة طلب الإذن:", granted);
        return granted;
      }}
      onClose={onClose}
      onManualEntry={() => {
        // يمكن إضافة الإدخال اليدوي هنا في المستقبل
        console.log("طلب الإدخال اليدوي");
      }}
    />;
  }
  
  // عرض شاشة الخطأ
  if (scannerError) {
    return <ScannerErrorView 
      errorMessage={scannerError} 
      onRetry={handleRetry} 
      onClose={onClose} 
    />;
  }
  
  // عرض معلومات التصحيح
  if (debugMode) {
    return (
      <div className="fixed inset-0 bg-white z-50 p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">معلومات التصحيح</h2>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
          {JSON.stringify({
            hasPermission,
            cameraActive,
            isScanningActive,
            scannerError,
            platform: Capacitor.getPlatform(),
            isNative: Capacitor.isNativePlatform(),
            autoStart,
          }, null, 2)}
        </pre>
        <div className="mt-4 space-y-2">
          <Button onClick={toggleDebugMode} className="w-full">إغلاق</Button>
          <Button onClick={handleRetry} className="w-full">إعادة المحاولة</Button>
          <Button onClick={onClose} className="w-full">إغلاق الماسح</Button>
        </div>
      </div>
    );
  }
  
  // عرض الكاميرا النشطة
  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <ActiveScannerView 
        cameraActive={cameraActive} 
        isScanningActive={isScanningActive}
        onClose={onClose} 
      />
      
      {/* زر للتحويل إلى وضع التصحيح - يمكن إخفاؤه في الإنتاج */}
      <button 
        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full text-xs"
        onClick={toggleDebugMode}
      >
        تصحيح
      </button>
    </div>
  );
};

export default ZXingBarcodeScanner;
