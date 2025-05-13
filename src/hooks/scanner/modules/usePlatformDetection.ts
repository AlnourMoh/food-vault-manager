
import { useCallback, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PlatformService } from '@/services/scanner/PlatformService';

/**
 * هوك للكشف عن منصة التشغيل وبيئة العمل
 */
export const usePlatformDetection = () => {
  const [isNative, setIsNative] = useState<boolean>(false);
  const [isInAppWebView, setIsInAppWebView] = useState<boolean>(false);
  const [isBrowser, setIsBrowser] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [platform, setPlatform] = useState<string>('web');

  // تهيئة البيانات عند التحميل
  useEffect(() => {
    try {
      const native = PlatformService.isNativePlatform();
      const inAppWebView = PlatformService.isInAppWebView();
      const browser = PlatformService.isBrowserEnvironment();
      const mobile = PlatformService.isMobileDevice();
      
      setIsNative(native);
      setIsInAppWebView(inAppWebView);
      setIsBrowser(browser);
      setIsMobile(mobile);
      setPlatform(Capacitor.getPlatform());
      
      // طباعة معلومات البيئة للتشخيص
      console.log('[usePlatformDetection] معلومات البيئة:', {
        native,
        inAppWebView,
        browser,
        mobile,
        platform: Capacitor.getPlatform(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('[usePlatformDetection] خطأ في تحديد البيئة:', error);
    }
  }, []);

  /**
   * يحدد ما إذا كان يجب معالجة الماسح بشكل خاص بناءً على البيئة
   */
  const requiresSpecialScannerHandling = useCallback(() => {
    return isNative || isInAppWebView;
  }, [isNative, isInAppWebView]);

  return {
    isNativePlatform: isNative,
    isInAppWebView,
    isBrowserEnvironment: isBrowser,
    isMobileDevice: isMobile,
    platform,
    requiresSpecialScannerHandling
  };
};
