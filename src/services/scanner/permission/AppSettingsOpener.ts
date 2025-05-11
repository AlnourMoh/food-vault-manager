
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

/**
 * خدمة فتح إعدادات التطبيق للحصول على الأذونات
 */
export class AppSettingsOpener {
  /**
   * فتح إعدادات التطبيق
   */
  public static async openAppSettings(): Promise<boolean> {
    try {
      console.log('AppSettingsOpener: محاولة فتح إعدادات التطبيق');
      
      // التحقق من المنصة
      const platform = Capacitor.getPlatform();
      
      if (platform === 'android') {
        // على Android، نفتح إعدادات التطبيق باستخدام package URL
        const appInfo = await App.getInfo();
        await Browser.open({
          url: `package:${appInfo.id}`
        });
        return true;
      } else if (platform === 'ios') {
        // على iOS، نفتح إعدادات التطبيق باستخدام URL مخصص
        await Browser.open({
          url: 'app-settings:'
        });
        return true;
      } else {
        // على الويب، نظهر رسالة توجيه للمستخدم
        console.log('AppSettingsOpener: هذه المنصة لا تدعم فتح الإعدادات تلقائيًا');
        
        // عرض إشعار للمستخدم
        if (Capacitor.isNativePlatform()) {
          await Toast.show({
            text: 'يرجى فتح إعدادات جهازك وتمكين أذونات الكاميرا للتطبيق',
            duration: 'long'
          });
        }
        
        return false;
      }
    } catch (error) {
      console.error('AppSettingsOpener: خطأ في فتح إعدادات التطبيق', error);
      return false;
    }
  }
}
