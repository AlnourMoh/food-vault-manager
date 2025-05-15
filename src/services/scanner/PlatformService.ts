
import { Capacitor } from '@capacitor/core';

/**
 * خدمة للكشف عن بيئة تشغيل التطبيق
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
   * التحقق مما إذا كان التطبيق يعمل على منصة أصلية
   */
  public isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }
  
  /**
   * التحقق مما إذا كان التطبيق يعمل في عرض ويب داخل تطبيق أصلي
   */
  public isWebView(): boolean {
    const webViewRegex = /(iPhone|iPod|iPad|Android).*(wv|WebView)/i;
    return webViewRegex.test(navigator.userAgent.toLowerCase());
  }
  
  /**
   * التحقق مما إذا كان التطبيق مثبت كتطبيق مستقل
   */
  public isInstalledApp(): boolean {
    const mobileAppRegex = /food-vault-manager|app\.lovable\./i;
    return mobileAppRegex.test(navigator.userAgent.toLowerCase()) || 
           mobileAppRegex.test(document.referrer);
  }
  
  /**
   * التحقق مما إذا كان الملحق المطلوب متاحاً
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
   * التحقق مما إذا كان الجهاز أندرويد
   */
  public isAndroid(): boolean {
    return this.getPlatform() === 'android' || /Android/i.test(navigator.userAgent);
  }
  
  /**
   * التحقق مما إذا كان الجهاز iOS
   */
  public isIOS(): boolean {
    return this.getPlatform() === 'ios' || /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const platformService = PlatformService.getInstance();
