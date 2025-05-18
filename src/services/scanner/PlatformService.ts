import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * خدمة تحديد منصة التشغيل والكشف عن البيئة المحيطة
 */
class PlatformService {
  private static instance: PlatformService;
  
  private constructor() {}
  
  public static getInstance(): PlatformService {
    if (!PlatformService.instance) {
      PlatformService.instance = new PlatformService();
    }
    return PlatformService.instance;
  }
  
  /**
   * التحقق مما إذا كنا في بيئة أصلية (تطبيق جوال)
   */
  public isNativePlatform(): boolean {
    try {
      return Capacitor.isNativePlatform();
    } catch (e) {
      console.error('[PlatformService] خطأ في التحقق من البيئة الأصلية:', e);
      return false;
    }
  }
  
  /**
   * التحقق مما إذا كان التطبيق يعمل داخل WebView
   */
  public isWebView(): boolean {
    try {
      // WebView غالبًا ما يتضمن 'wv' في سلسلة وكيل المستخدم
      const userAgent = navigator.userAgent.toLowerCase();
      return userAgent.includes('wv') || // أندرويد WebView
             userAgent.includes('; wv)') || // شكل آخر لأندرويد
             userAgent.includes('fban/') || // Facebook WebView
             userAgent.includes('fbav/') || // Facebook app
             userAgent.includes('instagram') || // Instagram WebView
             userAgent.includes('twitter') || // Twitter WebView
             (userAgent.includes('iphone') && !userAgent.includes('safari')); // iOS WebView
    } catch (e) {
      console.error('[PlatformService] خطأ في التحقق من WebView:', e);
      return false;
    }
  }
  
  /**
   * التحقق مما إذا كان التطبيق تم تثبيته كتطبيق PWA
   */
  public isInstalledApp(): boolean {
    try {
      return window.matchMedia('(display-mode: standalone)').matches ||
             (window.navigator as any).standalone === true; // iOS
    } catch (e) {
      console.error('[PlatformService] خطأ في التحقق من وضع التثبيت:', e);
      return false;
    }
  }
  
  /**
   * التحقق مما إذا كان الملحق متاحًا
   */
  public isPluginAvailable(pluginName: string): boolean {
    try {
      return Capacitor.isPluginAvailable(pluginName);
    } catch (e) {
      console.error(`[PlatformService] خطأ في التحقق من الملحق ${pluginName}:`, e);
      return false;
    }
  }
  
  /**
   * الحصول على منصة التشغيل الحالية
   */
  public getPlatform(): string {
    try {
      return Capacitor.getPlatform();
    } catch (e) {
      console.error('[PlatformService] خطأ في الحصول على المنصة:', e);
      return 'web'; // افتراضي
    }
  }
  
  /**
   * الحصول على معرف التطبيق
   */
  public async getAppId(): Promise<string> {
    try {
      if (this.isNativePlatform() && this.isPluginAvailable('App')) {
        const appInfo = await App.getInfo();
        return appInfo.id || 'app.lovable.foodvault.manager';
      }
      return 'app.lovable.foodvault.manager';
    } catch (e) {
      console.error('[PlatformService] خطأ في الحصول على معرف التطبيق:', e);
      return 'app.lovable.foodvault.manager';
    }
  }
  
  /**
   * الإبلاغ عن معلومات البيئة المحيطة
   */
  public getEnvironmentInfo(): Record<string, any> {
    return {
      isNative: this.isNativePlatform(),
      isWebView: this.isWebView(),
      isInstalledApp: this.isInstalledApp(),
      platform: this.getPlatform(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      plugins: {
        camera: this.isPluginAvailable('Camera'),
        barcodeScanner: this.isPluginAvailable('BarcodeScanner'),
        mlkit: this.isPluginAvailable('MLKitBarcodeScanner')
      }
    };
  }
}

// تصدير نسخة واحدة من الخدمة
export const platformService = PlatformService.getInstance();
