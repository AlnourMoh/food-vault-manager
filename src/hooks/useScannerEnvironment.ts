
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

/**
 * هوك للكشف عن بيئة تشغيل الماسح الضوئي
 */
export const useScannerEnvironment = () => {
  const [environment, setEnvironment] = useState(() => {
    const webViewRegex = /(iPhone|iPod|iPad|Android).*(wv|WebView)/i;
    const mobileAppRegex = /food-vault-manager|app\.lovable\./i;
    
    // اكتشاف بيئة تشغيل الماسح الضوئي
    const isNativePlatform = Capacitor.isNativePlatform();
    const isWebView = webViewRegex.test(navigator.userAgent.toLowerCase());
    const isInstalledApp = mobileAppRegex.test(navigator.userAgent.toLowerCase()) || 
                          mobileAppRegex.test(document.referrer);
                          
    // اكتشاف نوع الجهاز
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // تحقق من وجود Capacitor
    const hasCapacitor = typeof window.Capacitor !== 'undefined';
    
    // تحقق من وجود الملحقات
    const availablePlugins = {
      mlkitScanner: Capacitor.isPluginAvailable('MLKitBarcodeScanner'),
      barcodeScanner: Capacitor.isPluginAvailable('BarcodeScanner'),
      camera: Capacitor.isPluginAvailable('Camera'),
      app: Capacitor.isPluginAvailable('App'),
      browser: Capacitor.isPluginAvailable('Browser')
    };
    
    return {
      isNativePlatform,
      isWebView,
      isInstalledApp,
      isEffectivelyNative: isNativePlatform || isWebView || isInstalledApp,
      isMobileDevice,
      isAndroid,
      isIOS,
      platform: Capacitor.getPlatform(),
      userAgent: navigator.userAgent,
      hasCapacitor,
      availablePlugins
    };
  });
  
  // تحديث البيئة عند التغييرات
  useEffect(() => {
    console.log('[useScannerEnvironment] تفاصيل البيئة:', environment);
  }, [environment]);
  
  return environment;
};

export default useScannerEnvironment;
