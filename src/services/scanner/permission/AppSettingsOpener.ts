
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

/**
 * خدمة فتح إعدادات التطبيق للوصول إلى أذونات الكاميرا
 */
export class AppSettingsOpener {
  /**
   * محاولة فتح إعدادات التطبيق باستخدام الطريقة المناسبة حسب المنصة والإصدار
   */
  public static async openAppSettings(): Promise<boolean> {
    try {
      console.log('[AppSettingsOpener] محاولة فتح إعدادات التطبيق');
      
      // التحقق من بيئة التشغيل
      if (!Capacitor.isNativePlatform()) {
        console.log('[AppSettingsOpener] لسنا في بيئة أصلية، عرض تعليمات بديلة');
        await Toast.show({
          text: 'يرجى فتح إعدادات المتصفح وتمكين إذن الكاميرا',
          duration: 'long'
        });
        return false;
      }
      
      // محاولة استخدام ملحق MLKit لفتح الإعدادات (طريقة مفضلة)
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          console.log('[AppSettingsOpener] محاولة استخدام openSettings من MLKit');
          // فتح الإعدادات باستخدام MLKit
          await BarcodeScanner.openSettings();
          return true;
        } catch (e) {
          console.warn('[AppSettingsOpener] فشل استخدام openSettings من MLKit:', e);
        }
      }
      
      // إظهار تعليمات للمستخدم حسب المنصة
      const platform = Capacitor.getPlatform();
      if (platform === 'ios') {
        await Toast.show({
          text: 'يرجى فتح إعدادات جهازك > الخصوصية > الكاميرا، وتمكين إذن الكاميرا للتطبيق',
          duration: 'long'
        });
      } else if (platform === 'android') {
        await Toast.show({
          text: 'يرجى فتح إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات، وتمكين إذن الكاميرا',
          duration: 'long'
        });
      }
      
      return false;
    } catch (error) {
      console.error('[AppSettingsOpener] خطأ في فتح إعدادات التطبيق:', error);
      return false;
    }
  }
}
