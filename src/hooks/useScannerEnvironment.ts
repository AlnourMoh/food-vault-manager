
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
}

export const useScannerEnvironment = () => {
  const [environment, setEnvironment] = useState<ScannerEnvironment>({
    isNativePlatform: false,
    isWebView: false,
    isInstalledApp: false,
    platform: 'web',
    hasBarcodeSupport: false,
    barcodeScannerPlugin: null
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
      
      setEnvironment({
        isNativePlatform,
        isWebView,
        isInstalledApp,
        platform,
        hasBarcodeSupport: hasMLKit || hasTraditional,
        barcodeScannerPlugin: hasMLKit ? 'MLKitBarcodeScanner' : (hasTraditional ? 'BarcodeScanner' : null)
      });
      
      // تسجيل تفاصيل البيئة للتشخيص
      console.log('[useScannerEnvironment] تفاصيل بيئة التشغيل:', {
        isNativePlatform,
        isWebView,
        isInstalledApp,
        platform,
        hasMLKit,
        hasTraditional
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return environment;
};
