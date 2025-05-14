
import { Capacitor } from '@capacitor/core';

/**
 * خدمة تحديد منصة التشغيل وقدرات الجهاز
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
   * التحقق إذا كنا في بيئة جهاز أصلية
   */
  public isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }
  
  /**
   * التحقق إذا كنا في بيئة WebView
   */
  public isWebView(): boolean {
    // WebView عادة ما يحتوي وكيل المستخدم على كلمة
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('wv') || // Android WebView
           userAgent.includes('capacitor') ||
           (userAgent.includes('mobile') && userAgent.includes('safari') && !userAgent.includes('chrome')); // iOS WebView
  }
  
  /**
   * التحقق إذا كان التطبيق مثبت على الجهاز
   */
  public isInstalledApp(): boolean {
    // تطبيقات PWA المثبتة ستحتوي على هذا في الخصائص
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }
  
  /**
   * التحقق إذا كان الملحق المحدد متوفر
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
   * التحقق من دعم التصوير
   */
  public hasImageCaptureSupport(): boolean {
    return Capacitor.isPluginAvailable('Camera');
  }
  
  /**
   * التحقق من دعم ماسح الباركود
   */
  public hasBarcodeScannerSupport(): boolean {
    return Capacitor.isPluginAvailable('MLKitBarcodeScanner') || 
           Capacitor.isPluginAvailable('BarcodeScanner');
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const platformService = PlatformService.getInstance();
