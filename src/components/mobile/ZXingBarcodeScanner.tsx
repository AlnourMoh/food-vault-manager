
import React, { useEffect } from 'react';
import { useZXingBarcodeScanner } from '@/hooks/scanner/useZXingBarcodeScanner';
import { ScannerLoadingView } from './scanner/components/ScannerLoadingView';
import { PermissionRequestView } from './scanner/components/PermissionRequestView';
import { ScannerErrorView } from './scanner/components/ScannerErrorView';
import { ActiveScannerView } from './scanner/components/ActiveScannerView';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

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
    handleRetry
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
  
  // عرض شاشة التحميل
  if (isLoading) {
    return <ScannerLoadingView onClose={onClose} />;
  }
  
  // عرض شاشة طلب الإذن
  if (hasPermission === false) {
    return <PermissionRequestView 
      onRequestPermission={async () => {
        const granted = await requestPermission();
        console.log("نتيجة طلب الإذن:", granted);
      }} 
      onClose={onClose} 
    />;
  }
  
  // عرض شاشة الخطأ
  if (hasScannerError) {
    return <ScannerErrorView errorMessage={"حدث خطأ في الماسح الضوئي"} onRetry={handleRetry} onClose={onClose} />;
  }
  
  // عرض الكاميرا النشطة
  return <ActiveScannerView cameraActive={cameraActive} onClose={onClose} />;
};

export default ZXingBarcodeScanner;
