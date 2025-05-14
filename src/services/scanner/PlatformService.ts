
import { Capacitor } from '@capacitor/core';

/**
 * خدمة تحديد بيئة التشغيل للتطبيق
 */
export class PlatformService {
  private static instance: PlatformService;

  private constructor() {}

  public static getInstance(): PlatformService {
    if (!PlatformService.instance) {
      PlatformService.instance = new PlatformService();
    }
    return PlatformService.instance;
  }

  /**
   * التحقق من وجود منصة أصلية (iOS, Android)
   */
  public isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * التحقق من وجود Capacitor في الصفحة
   */
  public hasCapacitor(): boolean {
    return 'Capacitor' in window;
  }

  /**
   * التحقق من التشغيل في WebView
   */
  public isWebView(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('wv') || 
           userAgent.includes('capacitor');
  }

  /**
   * التحقق من كون التطبيق مثبت
   */
  public isInstalledApp(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           ('standalone' in navigator && (navigator as any).standalone === true);
  }

  /**
   * الحصول على منصة التشغيل الحالية
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
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const platformService = PlatformService.getInstance();
