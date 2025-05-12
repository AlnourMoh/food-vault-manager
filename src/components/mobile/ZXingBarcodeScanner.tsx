
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
import { Button } from '@/components/ui/button';

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
    isScanningActive,
    scannerError,
    requestPermission,
    handleRetry,
    openAppSettings,
    startScan
  } = useZXingBarcodeScanner({ onScan, onClose, autoStart });

  // تفعيل الكاميرا فوراً
  useEffect(() => {
    const activateCamera = async () => {
      if (hasPermission === true && autoStart && !cameraActive) {
        console.log("ZXingBarcodeScanner: تفعيل الكاميرا مباشرة");
        try {
          const started = await startScan();
          console.log("ZXingBarcodeScanner: نتيجة تفعيل الكاميرا:", started);
          
          if (!started) {
            console.warn("ZXingBarcodeScanner: محاولة ثانية لتفعيل الكاميرا");
            await new Promise(resolve => setTimeout(resolve, 500));
            await startScan();
          }
        } catch (error) {
          console.error("ZXingBarcodeScanner: خطأ في تفعيل الكاميرا:", error);
        }
      }
    };
    
    activateCamera();
  }, [hasPermission, autoStart, cameraActive, startScan]);
  
  // طلب الأذونات مباشرة عند التحميل
  useEffect(() => {
    if (hasPermission === false && autoStart) {
      console.log("طلب أذونات الكاميرا فوراً");
      const attemptPermission = async () => {
        try {
          const result = await scannerPermissionService.requestPermission();
          return result;
        } catch (error) {
          console.error("خطأ في طلب إذن الكاميرا:", error);
          return false;
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
        return granted;
      }}
      onClose={onClose}
      onManualEntry={() => {
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
  
  // عرض الكاميرا النشطة مباشرة
  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <ActiveScannerView 
        cameraActive={cameraActive} 
        isScanningActive={isScanningActive}
        onClose={onClose} 
      />
    </div>
  );
};

export default ZXingBarcodeScanner;
