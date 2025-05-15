
import { Capacitor } from '@capacitor/core';

/**
 * خدمة للكشف عن منصة التشغيل وخصائصها
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
   * التحقق مما إذا كنا في منصة أصلية
   */
  public isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * التحقق مما إذا كنا في WebView
   */
  public isWebView(): boolean {
    return /wv|WebView/.test(navigator.userAgent);
  }

  /**
   * التحقق مما إذا كنا في تطبيق مثبت
   */
  public isInstalledApp(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true;
  }

  /**
   * التحقق من توفر ملحق معين
   */
  public isPluginAvailable(pluginName: string): boolean {
    return Capacitor.isPluginAvailable(pluginName);
  }

  /**
   * الحصول على منصة التشغيل الحالية
   */
  public getPlatform(): string {
    return Capacitor.getPlatform();
  }

  /**
   * التحقق مما إذا كان الجهاز جوال
   */
  public isMobileDevice(): boolean {
    return /Android|iPhone|iPad|iPod/.test(navigator.userAgent);
  }

  /**
   * التحقق مما إذا كان الجهاز يعمل بنظام أندرويد
   */
  public isAndroid(): boolean {
    return /Android/.test(navigator.userAgent);
  }

  /**
   * التحقق مما إذا كان الجهاز يعمل بنظام iOS
   */
  public isIOS(): boolean {
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
  }
  
  /**
   * الحصول على معلومات كاملة عن البيئة
   */
  public getEnvironmentInfo() {
    const isNative = this.isNativePlatform();
    const isWebView = this.isWebView();
    const isInstalledApp = this.isInstalledApp();
    const isMobileDevice = this.isMobileDevice();
    
    return {
      isNativePlatform: isNative,
      isWebView,
      isInstalledApp,
      isEffectivelyNative: isNative || isWebView || isInstalledApp,
      isMobileDevice,
      isAndroid: this.isAndroid(),
      isIOS: this.isIOS(),
      platform: this.getPlatform(),
      userAgent: navigator.userAgent,
      hasCapacitor: typeof window.Capacitor !== 'undefined',
      availablePlugins: {
        mlkitScanner: this.isPluginAvailable('MLKitBarcodeScanner'),
        barcodeScanner: this.isPluginAvailable('BarcodeScanner'),
        camera: this.isPluginAvailable('Camera'),
        app: this.isPluginAvailable('App'),
        browser: this.isPluginAvailable('Browser')
      }
    };
  }
}

export const platformService = PlatformService.getInstance();
