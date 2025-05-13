
import { Capacitor } from '@capacitor/core';

/**
 * خدمة لتحديد منصة التشغيل وبيئة العمل
 */
export class PlatformService {
  /**
   * التحقق مما إذا كان التطبيق يعمل على منصة أصلية (أندرويد أو iOS)
   */
  static isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * التحقق مما إذا كان التطبيق يعمل داخل WebView في تطبيق جوال
   */
  static isInAppWebView(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('wv') || // Android WebView
           userAgent.includes('safari') && navigator.userAgent.includes('Mobile'); // iOS WebView often includes Safari
  }

  /**
   * التحقق مما إذا كان المستخدم في متصفح عادي وليس في تطبيق جوال
   */
  static isBrowserEnvironment(): boolean {
    return !this.isNativePlatform() && !this.isInAppWebView();
  }

  /**
   * الحصول على اسم المنصة الحالية
   */
  static getPlatform(): string {
    return Capacitor.getPlatform();
  }

  /**
   * التحقق مما إذا كانت بيئة العمل تتطلب معاملة خاصة للماسح
   * (مثل إخفاء أو إظهار عناصر معينة)
   */
  static requiresSpecialScannerHandling(): boolean {
    // على أندرويد أو iOS داخل WebView، نحتاج إلى معالجة خاصة
    return this.isInAppWebView() || this.isNativePlatform();
  }

  /**
   * التحقق مما إذا كان الجهاز محمول أم لا
   */
  static isMobileDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  }
}
