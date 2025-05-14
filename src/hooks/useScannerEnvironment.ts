
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PlatformService } from '@/services/scanner/PlatformService';

/**
 * هوك للتحقق من بيئة تشغيل الماسح الضوئي
 */
export const useScannerEnvironment = () => {
  const [isNativePlatform, setIsNativePlatform] = useState(false);
  const [isInAppWebView, setIsInAppWebView] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // التحقق من البيئة
    const platformCheck = () => {
      try {
        const native = Capacitor.isNativePlatform();
        const inAppWebView = PlatformService.isInAppWebView();
        const browser = !native && !inAppWebView;
        
        setIsNativePlatform(native);
        setIsInAppWebView(inAppWebView);
        setIsBrowser(browser);
        
        // الماسح مدعوم في التطبيق الأصلي أو WebView
        setIsSupported(native || inAppWebView);
        
        console.log('[useScannerEnvironment] معلومات البيئة:', {
          native,
          inAppWebView,
          browser,
          isSupported: native || inAppWebView,
          userAgent: navigator.userAgent,
          platform: Capacitor.getPlatform()
        });
      } catch (error) {
        console.error('[useScannerEnvironment] خطأ في تحديد البيئة:', error);
        setIsSupported(false);
      }
    };

    platformCheck();
  }, []);

  return {
    isNativePlatform,
    isInAppWebView,
    isBrowserOnly: isBrowser,
    isSupported,
    platformName: Capacitor.getPlatform(),
    // إضافة الخصائص المتوافقة
    isWebView: isInAppWebView,
    platform: Capacitor.getPlatform()
  };
};
