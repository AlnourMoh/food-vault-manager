
import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

import { useScannerState } from './hooks/useScannerState';
import { useScannerActions } from './hooks/useScannerActions';
import { BrowserView, ScannerLayout } from './components';
import { platformService } from '@/services/scanner/PlatformService';

interface SimpleBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const SimpleBarcodeScanner: React.FC<SimpleBarcodeScannerProps> = ({ 
  onScan, 
  onClose, 
  autoStart = false 
}) => {
  const scannerState = useScannerState(autoStart);
  const { startScan, stopScan } = useScannerActions({ 
    onScan, 
    onClose, 
    autoStart, 
    scannerState 
  });
  
  // تحسين اكتشاف البيئة الأصلية
  const isNativePlatform = platformService.isNativePlatform();
  const isWebView = platformService.isWebView();
  const isInstalledApp = platformService.isInstalledApp();
  
  // اعتبار البيئة أصلية إذا كان أي من الفحوصات إيجابي
  const isEffectivelyNative = isNativePlatform || isWebView || isInstalledApp;
  
  // تسجيل معلومات تشخيصية للمساعدة في اكتشاف المشكلة
  useEffect(() => {
    console.log('SimpleBarcodeScanner: تشخيص البيئة:', {
      isNative: Capacitor.isNativePlatform(),
      isWebView,
      isInstalledApp,
      isEffective: isEffectivelyNative,
      platform: Capacitor.getPlatform(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      availablePlugins: {
        MLKit: Capacitor.isPluginAvailable('MLKitBarcodeScanner'),
        Camera: Capacitor.isPluginAvailable('Camera')
      }
    });

    // بدء المسح تلقائيًا إذا كنا في بيئة أصلية وتم تعيين autoStart
    if (isEffectivelyNative && autoStart) {
      console.log('SimpleBarcodeScanner: بدء المسح تلقائيًا...');
      startScan();
    } else {
      scannerState.setIsLoading(false);
    }
  }, [isWebView, isInstalledApp, isEffectivelyNative, autoStart]);

  // في البيئة غير الأصلية المؤكدة، نعرض واجهة المتصفح
  if (!isEffectivelyNative) {
    return <BrowserView onClose={onClose} />;
  }

  // في البيئة الأصلية المحتملة، نحاول تشغيل الماسح
  return (
    <ScannerLayout 
      scannerState={scannerState}
      startScan={startScan}
      stopScan={() => {
        // Wrapper function to convert Promise<boolean> to Promise<void>
        stopScan().catch(error => {
          console.error('Error stopping scan:', error);
        });
      }}
      onClose={onClose}
    />
  );
};

export default SimpleBarcodeScanner;
