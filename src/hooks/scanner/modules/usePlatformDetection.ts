
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { platformService } from '@/services/scanner/PlatformService';

/**
 * هوك للتعرف على منصة التشغيل
 */
export const usePlatformDetection = () => {
  const [isNativePlatform, setIsNativePlatform] = useState<boolean>(false);
  const [platform, setPlatform] = useState<string>('web');
  const [pluginsAvailable, setPluginsAvailable] = useState<Record<string, boolean>>({});
  const [isWebView, setIsWebView] = useState<boolean>(false);

  // تهيئة عند التحميل
  useEffect(() => {
    // تحديد المنصة
    const nativePlatform = platformService.isNativePlatform();
    setIsNativePlatform(nativePlatform);
    setPlatform(platformService.getPlatform());
    setIsWebView(platformService.isWebView());
    
    // التحقق من الملحقات المتاحة
    const plugins: Record<string, boolean> = {
      'MLKitBarcodeScanner': Capacitor.isPluginAvailable('MLKitBarcodeScanner'),
      'BarcodeScanner': Capacitor.isPluginAvailable('BarcodeScanner'),
      'Camera': Capacitor.isPluginAvailable('Camera'),
      'Browser': Capacitor.isPluginAvailable('Browser'),
      'App': Capacitor.isPluginAvailable('App')
    };
    
    setPluginsAvailable(plugins);
    
    // طباعة معلومات عن البيئة للتشخيص
    console.log('[usePlatformDetection] معلومات البيئة:', {
      isNativePlatform: nativePlatform,
      platform: platformService.getPlatform(),
      isWebView: platformService.isWebView(),
      plugins
    });
  }, []);

  return {
    isNativePlatform,
    platform,
    pluginsAvailable,
    isAndroid: platform === 'android',
    isIOS: platform === 'ios',
    isWeb: platform === 'web',
    isWebView
  };
};
