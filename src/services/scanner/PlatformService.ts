
import { Capacitor } from '@capacitor/core';

/**
 * خدمة للتحقق من بيئة تشغيل التطبيق
 */
class PlatformService {
  /**
   * التحقق مما إذا كان التطبيق يعمل في بيئة أصلية
   */
  public isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * التحقق مما إذا كان التطبيق يعمل في وضع WebView
   */
  public isWebView(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    // تحسين اكتشاف WebView
    return userAgent.includes('wv') || 
           userAgent.includes('electron') || 
           userAgent.includes('capacitor');
  }

  /**
   * التحقق مما إذا كان التطبيق مثبتًا (وليس متصفحًا)
   */
  public isInstalledApp(): boolean {
    // اختبار وجود serviceWorker أو إذا كان التطبيق مثبتًا (PWA)
    return 'serviceWorker' in navigator || 
           window.matchMedia('(display-mode: standalone)').matches ||
           document.referrer.includes('android-app://');
  }

  /**
   * تسجيل معلومات تشخيصية عن البيئة
   */
  public logEnvironmentInfo(): void {
    console.log('PlatformService - بيئة التشغيل:', {
      platform: Capacitor.getPlatform(),
      isNative: this.isNativePlatform(),
      isWebView: this.isWebView(),
      isInstalled: this.isInstalledApp(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      availablePlugins: {
        MLKit: Capacitor.isPluginAvailable('MLKitBarcodeScanner'),
        Camera: Capacitor.isPluginAvailable('Camera'),
        BarcodeScanner: Capacitor.isPluginAvailable('BarcodeScanner')
      }
    });
  }
}

// تصدير وحدة الخدمة مباشرة
export const platformService = new PlatformService();
