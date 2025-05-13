
import { Capacitor } from '@capacitor/core';

/**
 * خدمة للتعامل مع اكتشاف المنصة والبيئة
 */
export class PlatformService {
  /**
   * التحقق من إذا كنا في بيئة تطبيق أصلية (Android/iOS)
   */
  public static isNativePlatform(): boolean {
    // التأكد من وجود كائن Capacitor وأننا في بيئة أصلية
    try {
      const isNative = Capacitor.isNativePlatform();
      console.log('[PlatformService] isNativePlatform:', isNative);
      console.log('[PlatformService] Platform:', this.getPlatform());
      return isNative;
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
      return Capacitor.getPlatform();
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
