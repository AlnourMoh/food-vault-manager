
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

/**
 * هوك للتعرف على منصة التشغيل
 */
export const usePlatformDetection = () => {
  const [isNativePlatform, setIsNativePlatform] = useState<boolean>(false);
  const [platform, setPlatform] = useState<string>('web');
  const [pluginsAvailable, setPluginsAvailable] = useState<Record<string, boolean>>({});

  // تهيئة عند التحميل
  useEffect(() => {
    // تحديد المنصة
    const nativePlatform = Capacitor.isNativePlatform();
    setIsNativePlatform(nativePlatform);
    setPlatform(Capacitor.getPlatform());
    
    // التحقق من الملحقات المتاحة
    const plugins: Record<string, boolean> = {
      'MLKitBarcodeScanner': Capacitor.isPluginAvailable('MLKitBarcodeScanner'),
      'BarcodeScanner': Capacitor.isPluginAvailable('BarcodeScanner'),
      'Camera': Capacitor.isPluginAvailable('Camera'),
      'Browser': Capacitor.isPluginAvailable('Browser'),
      'App': Capacitor.isPluginAvailable('App')
    };
    
    setPluginsAvailable(plugins);
  }, []);

  return {
    isNativePlatform,
    platform,
    pluginsAvailable,
    isAndroid: platform === 'android',
    isIOS: platform === 'ios',
    isWeb: platform === 'web'
  };
};
