
import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

import { useScannerState } from './hooks/useScannerState';
import { useScannerActions } from './hooks/useScannerActions';
import { BrowserView } from './components/BrowserView';
import ScannerLayout from './components/ScannerLayout';
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
  }, [isWebView, isInstalledApp, isEffectivelyNative]);

  // في البيئة غير الأصلية المؤكدة، نعرض واجهة المتصفح
  if (!isEffectivelyNative) {
    return <BrowserView onClose={onClose} />;
  }

  // في البيئة الأصلية المحتملة، نحاول تشغيل الماسح
  return (
    <ScannerLayout 
      scannerState={scannerState}
      startScan={startScan}
      stopScan={stopScan}
      onClose={onClose}
    />
  );
};

export default SimpleBarcodeScanner;
