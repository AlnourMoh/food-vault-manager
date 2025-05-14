
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
    isInstalledApp: false,
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
        // التحقق من بيئة التشغيل بالطرق المتعددة
        const isNative = platformService.isNativePlatform();
        const isWebView = platformService.isWebView();
        const platform = platformService.getPlatform();
        const isInstalledApp = platformService.isInstalledApp();
        
        // تحسين القرارات: نعتبر البيئة أصلية إذا كان أي من الفحوصات إيجابي
        const effectivelyNative = isNative || isWebView || isInstalledApp;
        
        // التحقق من وجود علامات WebView إضافية
        const userAgent = navigator.userAgent.toLowerCase();
        const hasWebViewMarkers = userAgent.includes('wv') || 
                          userAgent.includes('foodvaultmanage') || 
                          userAgent.includes('capacitor') ||
                          userAgent.includes('app.lovable.foodvault.manager') ||
                          (userAgent.includes('android') && !userAgent.includes('chrome'));
        
        // التحقق من توفر المكونات الإضافية
        const hasCapacitor = platformService.hasCapacitor();
        const availablePlugins = {
          mlkitScanner: Capacitor.isPluginAvailable('MLKitBarcodeScanner'),
          camera: Capacitor.isPluginAvailable('Camera'),
          barcodeScanner: Capacitor.isPluginAvailable('BarcodeScanner'),
          app: Capacitor.isPluginAvailable('App')
        };
        
        // تسجيل معلومات تشخيصية إضافية
        console.log('[useScannerEnvironment] معلومات وكيل المستخدم:', userAgent);
        console.log('[useScannerEnvironment] referrer:', document.referrer);
        console.log('[useScannerEnvironment] اكتشاف APK مثبت:', isInstalledApp);
        
        // تعيين حالة البيئة المحسّنة
        setEnvironment({
          // اعتبار التطبيق في بيئة أصلية إذا كان أي من الفحوصات إيجابي
          isNativePlatform: effectivelyNative,
          platform,
          isWebView: isWebView || hasWebViewMarkers,
          hasCapacitor,
          isInstalledApp,
          availablePlugins
        });
        
        console.log('[useScannerEnvironment] تم تشخيص البيئة بالطريقة المحسّنة:', {
          isNativePlatform: effectivelyNative,
          platform,
          isWebView: isWebView || hasWebViewMarkers,
          userAgent,
          hasCapacitor,
          isInstalledApp,
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
