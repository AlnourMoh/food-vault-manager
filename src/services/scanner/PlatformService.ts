
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
   * التحقق إذا كنا في منصة أصلية (جهاز حقيقي)
   */
  public isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }
  
  /**
   * التحقق من WebView (مثل في تطبيق أندرويد مضمن)
   */
  public isWebView(): boolean {
    return /wv|WebView/.test(navigator.userAgent);
  }
  
  /**
   * التحقق ما إذا كان التطبيق مثبت كتطبيق مستقل
   */
  public isInstalledApp(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true;
  }
  
  /**
   * التحقق من توفر ملحق كاباسيتور محدد
   */
  public isPluginAvailable(pluginName: string): boolean {
    return Capacitor.isPluginAvailable(pluginName);
  }
  
  /**
   * الحصول على اسم المنصة الحالية
   */
  public getPlatform(): string {
    return Capacitor.getPlatform();
  }
  
  /**
   * التحقق ما إذا كان الجهاز أندرويد
   */
  public isAndroid(): boolean {
    return this.getPlatform() === 'android' || /Android/i.test(navigator.userAgent);
  }
  
  /**
   * التحقق ما إذا كان الجهاز iOS
   */
  public isIOS(): boolean {
    return this.getPlatform() === 'ios' || /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  
  /**
   * التحقق ما إذا كان الجهاز جوال
   */
  public isMobileDevice(): boolean {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
}

// تصدير مثيل وحيد من الخدمة
export const platformService = PlatformService.getInstance();
