
import { Capacitor } from '@capacitor/core';

/**
 * خدمة للتحقق من بيئة التشغيل
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
   * التحقق إذا كنا في بيئة أصلية (تطبيق جوال)
   */
  public isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }
  
  /**
   * التحقق من توفر ملحق معين
   */
  public isPluginAvailable(pluginName: string): boolean {
    return Capacitor.isPluginAvailable(pluginName);
  }
  
  /**
   * التحقق إذا كنا في WebView
   */
  public isWebView(): boolean {
    return navigator.userAgent.toLowerCase().indexOf(' wv') > -1 || 
           navigator.userAgent.indexOf('Android') !== -1;
  }
  
  /**
   * التحقق إذا كان التطبيق مثبتًا
   */
  public isInstalledApp(): boolean {
    // على iOS، التحقق من وجود "AppleWebKit" و عدم وجود "Safari"
    if (navigator.userAgent.includes('AppleWebKit') && 
        !navigator.userAgent.includes('Safari')) {
      return true;
    }
    
    // على Android، التحقق من وجود "wv" في userAgent
    if (navigator.userAgent.toLowerCase().includes(' wv')) {
      return true;
    }
    
    // التحقق من المتصفحات المضمنة المعروفة
    const embeddedBrowsers = ['cordova', 'capacitor', 'ionic'];
    for (const browser of embeddedBrowsers) {
      if (navigator.userAgent.toLowerCase().includes(browser)) {
        return true;
      }
    }
    
    // التحقق من خصائص الويب المعينة للتطبيقات المثبتة
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }
    
    return false;
  }
  
  /**
   * الحصول على منصة التشغيل
   */
  public getPlatform(): string {
    return Capacitor.getPlatform();
  }
}

// تصدير مثيل وحيد من الخدمة
export const platformService = PlatformService.getInstance();
