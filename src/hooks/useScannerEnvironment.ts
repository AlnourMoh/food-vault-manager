
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
        const isNative = platformService.isNativePlatform();
        const isWebView = platformService.isWebView();
        const platform = platformService.getPlatform();
        
        // نعتبر أنفسنا في بيئة أصلية إذا كنا في WebView أو إذا كان Capacitor يقول ذلك
        const effectivelyNative = isNative || isWebView;
        
        // التحقق من وجود WebView
        const userAgent = navigator.userAgent.toLowerCase();
        const hasWebViewMarkers = userAgent.includes('wv') || 
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
        
        // تعيين حالة البيئة المحسّنة
        setEnvironment({
          // اعتبار التطبيق في بيئة أصلية إذا كان في WebView أيضاً
          isNativePlatform: effectivelyNative,
          platform,
          isWebView: isWebView || hasWebViewMarkers,
          hasCapacitor,
          availablePlugins
        });
        
        console.log('[useScannerEnvironment] تم تشخيص البيئة بالطريقة المحسّنة:', {
          isNativePlatform: effectivelyNative,
          platform,
          isWebView: isWebView || hasWebViewMarkers,
          userAgent,
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
