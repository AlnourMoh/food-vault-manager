
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export interface ScannerEnvironment {
  isNativePlatform: boolean;
  platform: string;
  isWebView: boolean;
  isInstalledApp: boolean;
  hasCapacitor: boolean;
  availablePlugins: {
    mlkitScanner: boolean;
    camera: boolean;
    barcodeScanner: boolean;
  };
  userAgent: string;
}

/**
 * Hook للتحقق من بيئة تشغيل الماسح الضوئي
 * يساعد في تحليل المشاكل وتوفير تجربة مناسبة لمختلف البيئات
 */
export const useScannerEnvironment = (): ScannerEnvironment => {
  const [environment, setEnvironment] = useState<ScannerEnvironment>({
    isNativePlatform: false,
    platform: '',
    isWebView: false,
    isInstalledApp: false,
    hasCapacitor: false,
    availablePlugins: {
      mlkitScanner: false,
      camera: false,
      barcodeScanner: false
    },
    userAgent: ''
  });

  useEffect(() => {
    const detectEnvironment = () => {
      // التحقق من وجود Capacitor
      const hasCapacitor = typeof window !== 'undefined' && !!window.Capacitor;
      
      // التحقق مما إذا كنا في بيئة أصلية
      let isNativePlatform = false;
      let platform = 'web';
      
      if (hasCapacitor) {
        isNativePlatform = Capacitor.isNativePlatform();
        platform = Capacitor.getPlatform();
      }
      
      // التحقق مما إذا كنا في WebView
      const userAgent = navigator.userAgent.toLowerCase();
      const isWebView = userAgent.includes('wv') || 
                        userAgent.includes('webview') ||
                        (userAgent.includes('android') && !userAgent.includes('chrome')) ||
                        (userAgent.includes('iphone') && !userAgent.includes('safari'));
      
      // التحقق مما إذا كنا في تطبيق مثبت
      const isInstalledApp = navigator.standalone === true || 
                            userAgent.includes('app.lovable.foodvault.manager') ||
                            window.matchMedia('(display-mode: standalone)').matches;
      
      // التحقق من الملحقات المتاحة
      const availablePlugins = {
        mlkitScanner: hasCapacitor && Capacitor.isPluginAvailable('MLKitBarcodeScanner'),
        camera: hasCapacitor && Capacitor.isPluginAvailable('Camera'),
        barcodeScanner: hasCapacitor && Capacitor.isPluginAvailable('BarcodeScanner')
      };
      
      setEnvironment({
        isNativePlatform,
        platform,
        isWebView,
        isInstalledApp,
        hasCapacitor,
        availablePlugins,
        userAgent
      });
      
      // تسجيل معلومات البيئة في وحدة التحكم
      console.log('Scanner Environment:', {
        isNativePlatform,
        platform,
        isWebView,
        isInstalledApp,
        hasCapacitor,
        availablePlugins,
        userAgent
      });
    };
    
    detectEnvironment();
  }, []);

  return environment;
};
