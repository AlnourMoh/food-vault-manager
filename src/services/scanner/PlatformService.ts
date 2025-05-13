
import { Capacitor } from '@capacitor/core';

/**
 * خدمة للتعامل مع اكتشاف المنصة والبيئة
 */
export class PlatformService {
  /**
   * التحقق من إذا كنا في بيئة تطبيق أصلية (Android/iOS)
   */
  public static isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * الحصول على اسم المنصة الحالية
   * @returns 'ios', 'android', 'web', أو 'electron'
   */
  public static getPlatform(): string {
    return Capacitor.getPlatform();
  }

  /**
   * التحقق من توفر إضافة معينة
   * @param pluginName اسم الإضافة للتحقق منها
   */
  public static isPluginAvailable(pluginName: string): boolean {
    return Capacitor.isPluginAvailable(pluginName);
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
