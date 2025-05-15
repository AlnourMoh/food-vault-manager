
import { Capacitor } from '@capacitor/core';

/**
 * خدمة للتعامل مع معلومات البيئة والمنصة
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
   * التحقق من بيئة الجوال الأصلية
   */
  public isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }
  
  /**
   * التحقق من بيئة WebView
   */
  public isWebView(): boolean {
    return /wv|WebView/.test(navigator.userAgent);
  }
  
  /**
   * التحقق من تثبيت التطبيق
   */
  public isInstalledApp(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true;
  }
  
  /**
   * الحصول على نظام التشغيل
   */
  public getPlatform(): string {
    return Capacitor.getPlatform();
  }
  
  /**
   * التحقق من توفر ملحق معين
   */
  public isPluginAvailable(pluginName: string): boolean {
    return Capacitor.isPluginAvailable(pluginName);
  }
  
  /**
   * التحقق من جهاز الجوّال
   */
  public isMobileDevice(): boolean {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  
  /**
   * التحقق من جهاز أندرويد
   */
  public isAndroid(): boolean {
    return /Android/i.test(navigator.userAgent);
  }
  
  /**
   * التحقق من جهاز iOS
   */
  public isIOS(): boolean {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  
  /**
   * الحصول على معلومات البيئة
   */
  public getEnvironmentInfo() {
    return {
      isNativePlatform: this.isNativePlatform(),
      isWebView: this.isWebView(),
      isInstalledApp: this.isInstalledApp(),
      isMobileDevice: this.isMobileDevice(),
      isAndroid: this.isAndroid(),
      isIOS: this.isIOS(),
      platform: this.getPlatform(),
      userAgent: navigator.userAgent,
      availablePlugins: {
        mlkitScanner: this.isPluginAvailable('MLKitBarcodeScanner'),
        barcodeScanner: this.isPluginAvailable('BarcodeScanner'),
        camera: this.isPluginAvailable('Camera')
      }
    };
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const platformService = PlatformService.getInstance();
