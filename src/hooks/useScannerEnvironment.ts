
import { useMemo } from 'react';
import { Capacitor } from '@capacitor/core';

/**
 * Hook للحصول على معلومات حول بيئة تشغيل الماسح
 */
export const useScannerEnvironment = () => {
  return useMemo(() => {
    const isNativePlatform = Capacitor.isNativePlatform();
    
    // التحقق من WebView في أندرويد
    const isWebView = /wv|WebView/.test(navigator.userAgent);
    
    // هل التطبيق مثبت
    const isInstalledApp = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
    
    // اعتبار البيئة أصلية إذا تم تصنيفها هكذا بأي من الطرق
    const isEffectivelyNative = isNativePlatform || isWebView || isInstalledApp;
    
    // التحقق من جهاز الجوّال
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // التعرف على نظام التشغيل
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
      isEffectivelyNative,
      isMobileDevice,
      isAndroid,
      isIOS,
      platform: Capacitor.getPlatform(),
      userAgent: navigator.userAgent,
      hasCapacitor,
      availablePlugins
    };
  });
};
