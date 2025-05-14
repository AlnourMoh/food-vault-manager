
import { useEffect, useState } from 'react';
import { platformService } from '@/services/scanner/PlatformService';
import { Capacitor } from '@capacitor/core';

interface ScannerEnvironment {
  isNativePlatform: boolean;
  isWebView: boolean;
  isInstalledApp: boolean;
  platform: string;
  hasBarcodeSupport: boolean;
  barcodeScannerPlugin: string | null;
  hasCapacitor: boolean;
  availablePlugins: {
    mlkitScanner: boolean;
    camera: boolean;
    barcodeScanner: boolean;
  };
}

export const useScannerEnvironment = () => {
  const [environment, setEnvironment] = useState<ScannerEnvironment>({
    isNativePlatform: false,
    isWebView: false,
    isInstalledApp: false,
    platform: 'web',
    hasBarcodeSupport: false,
    barcodeScannerPlugin: null,
    hasCapacitor: false,
    availablePlugins: {
      mlkitScanner: false,
      camera: false,
      barcodeScanner: false
    }
  });
  
  useEffect(() => {
    // تأخير قصير لضمان تحميل النوافذ بشكل صحيح
    const timer = setTimeout(() => {
      const isNativePlatform = platformService.isNativePlatform();
      const isWebView = platformService.isWebView();
      const isInstalledApp = platformService.isInstalledApp();
      const platform = platformService.getPlatform();
      
      // التحقق من دعم الباركود
      const hasMLKit = Capacitor.isPluginAvailable('MLKitBarcodeScanner');
      const hasTraditional = Capacitor.isPluginAvailable('BarcodeScanner');
      const hasCamera = Capacitor.isPluginAvailable('Camera');
      const hasCapacitor = typeof Capacitor !== 'undefined';
      
      setEnvironment({
        isNativePlatform,
        isWebView,
        isInstalledApp,
        platform,
        hasBarcodeSupport: hasMLKit || hasTraditional,
        barcodeScannerPlugin: hasMLKit ? 'MLKitBarcodeScanner' : (hasTraditional ? 'BarcodeScanner' : null),
        hasCapacitor,
        availablePlugins: {
          mlkitScanner: hasMLKit,
          camera: hasCamera,
          barcodeScanner: hasTraditional
        }
      });
      
      // تسجيل تفاصيل البيئة للتشخيص
      console.log('[useScannerEnvironment] تفاصيل بيئة التشغيل:', {
        isNativePlatform,
        isWebView,
        isInstalledApp,
        platform,
        hasMLKit,
        hasTraditional,
        hasCamera,
        hasCapacitor
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return environment;
};
