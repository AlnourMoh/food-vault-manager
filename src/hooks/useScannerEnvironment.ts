
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { platformService } from '@/services/scanner/PlatformService';

/**
 * هوك للتعرف على بيئة تشغيل الماسح الضوئي وتوفر المكونات
 */
export const useScannerEnvironment = () => {
  const [environment, setEnvironment] = useState({
    isNativePlatform: false,
    platform: 'web',
    isWebView: false,
    hasCapacitor: false,
    availablePlugins: {
      mlkitScanner: false,
      camera: false,
      barcodeScanner: false,
      app: false
    }
  });

  useEffect(() => {
    const detectEnvironment = async () => {
      try {
        // التحقق من بيئة التشغيل
        const isNative = Capacitor.isNativePlatform();
        const platform = Capacitor.getPlatform();
        
        // التحقق من وجود WebView
        const userAgent = navigator.userAgent.toLowerCase();
        const isWebView = userAgent.includes('wv') || 
                          userAgent.includes('foodvaultmanage') || 
                          userAgent.includes('capacitor');
        
        // التحقق من توفر المكونات الإضافية
        const hasCapacitor = platformService.hasCapacitor();
        const availablePlugins = {
          mlkitScanner: Capacitor.isPluginAvailable('MLKitBarcodeScanner'),
          camera: Capacitor.isPluginAvailable('Camera'),
          barcodeScanner: Capacitor.isPluginAvailable('BarcodeScanner'),
          app: Capacitor.isPluginAvailable('App')
        };
        
        setEnvironment({
          isNativePlatform: isNative,
          platform,
          isWebView,
          hasCapacitor,
          availablePlugins
        });
        
        console.log('[useScannerEnvironment] تم تشخيص البيئة:', {
          isNativePlatform: isNative,
          platform,
          isWebView,
          hasCapacitor,
          availablePlugins
        });
      } catch (error) {
        console.error('[useScannerEnvironment] خطأ في اكتشاف البيئة:', error);
      }
    };
    
    detectEnvironment();
  }, []);

  return environment;
};
