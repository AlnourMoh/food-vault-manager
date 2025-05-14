
import { Capacitor } from '@capacitor/core';

// Add interface augmentation for Navigator to include the standalone property
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

/**
 * خدمة للتعامل مع اكتشاف المنصة والبيئة
 */
export class PlatformService {
  /**
   * التحقق من إذا كنا في بيئة تطبيق أصلية (Android/iOS)
   */
  public static isNativePlatform(): boolean {
    try {
      // التحقق المباشر من Capacitor
      const isNative = Capacitor.isNativePlatform();
      
      // إذا كان Capacitor يخبرنا أننا في بيئة أصلية، نثق به
      if (isNative) {
        console.log('[PlatformService] تم اكتشاف بيئة أصلية عبر Capacitor');
        return true;
      }
      
      // اكتشاف إضافي للWebView في حالة عدم اكتشاف Capacitor للبيئة الأصلية
      const userAgent = navigator.userAgent.toLowerCase();
      const isInWebView = 
        userAgent.includes('wv') || 
        userAgent.includes('foodvaultmanage') || 
        userAgent.includes('capacitor') ||
        // البحث عن علامات WebView الإضافية في الأجهزة المختلفة
        (userAgent.includes('android') && userAgent.includes('version')) ||
        window.navigator.standalone === true;
      
      if (isInWebView) {
        console.log('[PlatformService] تم اكتشاف WebView من خلال وكيل المستخدم:', userAgent);
        return true;
      }
      
      console.log('[PlatformService] تم اكتشاف بيئة متصفح عادية');
      console.log('[PlatformService] Platform:', this.getPlatform());
      return false;
    } catch (e) {
      console.error('[PlatformService] Error checking native platform:', e);
      return false;
    }
  }

  /**
   * الحصول على اسم المنصة الحالية
   * @returns 'ios', 'android', 'web', أو 'electron'
   */
  public static getPlatform(): string {
    try {
      const platform = Capacitor.getPlatform();
      
      // التحقق الإضافي من المنصة باستخدام وكيل المستخدم
      if (platform === 'web') {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('android') || userAgent.includes('huawei')) {
          console.log('[PlatformService] تصحيح المنصة: تم اكتشاف Android من خلال وكيل المستخدم');
          return 'android';
        }
        
        if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
          console.log('[PlatformService] تصحيح المنصة: تم اكتشاف iOS من خلال وكيل المستخدم');
          return 'ios';
        }
      }
      
      return platform;
    } catch (e) {
      console.error('[PlatformService] Error getting platform:', e);
      return 'web';
    }
  }

  /**
   * التحقق من توفر إضافة معينة
   * @param pluginName اسم الإضافة للتحقق منها
   */
  public static isPluginAvailable(pluginName: string): boolean {
    try {
      const isAvailable = Capacitor.isPluginAvailable(pluginName);
      console.log(`[PlatformService] Plugin ${pluginName} availability:`, isAvailable);
      return isAvailable;
    } catch (e) {
      console.error(`[PlatformService] Error checking plugin ${pluginName}:`, e);
      return false;
    }
  }

  /**
   * التحقق من وجود Capacitor قبل محاولة استخدامه
   */
  public static hasCapacitor(): boolean {
    return typeof window !== 'undefined' && !!(window as any).Capacitor;
  }

  /**
   * اكتشاف إذا كنا في WebView
   */
  public static isWebView(): boolean {
    try {
      // اكتشاف WebView
      const userAgent = navigator.userAgent.toLowerCase();
      
      // علامات WebView المختلفة
      const webViewMarkers = [
        'wv', 'foodvaultmanage', 'capacitor',
        // Android WebView
        /android.*version\/[0-9\.]+/,
        // iOS WebView
        /iphone|ipad|ipod.*safari/
      ];
      
      // التحقق من كل علامة
      for (const marker of webViewMarkers) {
        if (typeof marker === 'string' && userAgent.includes(marker)) {
          console.log(`[PlatformService] تم اكتشاف WebView باستخدام العلامة: ${marker}`);
          return true;
        } else if (marker instanceof RegExp && marker.test(userAgent)) {
          console.log(`[PlatformService] تم اكتشاف WebView باستخدام النمط: ${marker}`);
          return true;
        }
      }
      
      // التحقق من خاصية standalone لـ iOS
      if (window.navigator.standalone === true) {
        console.log('[PlatformService] تم اكتشاف تطبيق شاشة رئيسية iOS');
        return true;
      }
      
      console.log('[PlatformService] لم يتم اكتشاف WebView');
      return false;
    } catch (e) {
      console.error('[PlatformService] خطأ في اكتشاف WebView:', e);
      return false;
    }
  }

  /**
   * التحقق من إذا كنا في بيئة تطوير
   */
  public static isDevelopmentEnvironment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  /**
   * التحقق من إذا كنا في بيئة اختبار
   */
  public static isTestEnvironment(): boolean {
    return process.env.NODE_ENV === 'test';
  }

  /**
   * التحقق من إذا كنا في بيئة إنتاج
   */
  public static isProductionEnvironment(): boolean {
    return process.env.NODE_ENV === 'production';
  }
}

export const platformService = PlatformService;
