
import React, { useEffect } from 'react';
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
  const {
    isLoading,
    hasPermission,
    cameraActive,
    scannerError: hasScannerError,
    requestPermission,
    handleRetry,
    openAppSettings
  } = useZXingBarcodeScanner({ onScan, onClose, autoStart });

  // إضافة سجل تشخيصي لتتبع حالة المكون
  useEffect(() => {
    const logDiagnostic = async () => {
      try {
        const platform = Capacitor.getPlatform();
        const isNative = Capacitor.isNativePlatform();
        const message = `حالة الماسح الضوئي - المنصة: ${platform}, أصلي: ${isNative ? 'نعم' : 'لا'}, الإذن: ${hasPermission === true ? 'ممنوح' : hasPermission === false ? 'مرفوض' : 'غير معروف'}`;
        
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
  }, [hasPermission]);
  
  // محاولة طلب الأذونات عند بدء التشغيل
  useEffect(() => {
    if (hasPermission === false && autoStart) {
      console.log("محاولة طلب الأذونات عند بدء التشغيل");
      
      // استخدام خدمة الأذونات المحسّنة
      const attemptPermission = async () => {
        try {
          // Fix: Return boolean value from the function call to match expected type
          const result = await scannerPermissionService.requestPermission();
          return result; // Return the boolean result
        } catch (error) {
          console.error("خطأ في طلب الإذن التلقائي:", error);
          return false; // Return false on error
        }
      };
      
      attemptPermission();
    }
  }, [hasPermission, autoStart]);
  
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
        return granted; // Return the result to match expected type
      }}
      onClose={onClose}
      onManualEntry={() => {
        // يمكن إضافة الإدخال اليدوي هنا في المستقبل
        console.log("طلب الإدخال اليدوي");
      }}
    />;
  }
  
  // عرض شاشة الخطأ
  if (hasScannerError) {
    return <ScannerErrorView 
      errorMessage={"حدث خطأ في الماسح الضوئي"} 
      onRetry={handleRetry} 
      onClose={onClose} 
    />;
  }
  
  // عرض الكاميرا النشطة
  return <ActiveScannerView cameraActive={cameraActive} onClose={onClose} />;
};

export default ZXingBarcodeScanner;
