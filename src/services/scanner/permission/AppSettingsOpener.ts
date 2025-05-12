
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

/**
 * فاتح إعدادات التطبيق على مختلف المنصات
 */
export class AppSettingsOpener {
  /**
   * فتح إعدادات التطبيق
   */
  public static async openAppSettings(): Promise<boolean> {
    try {
      console.log('[AppSettingsOpener] محاولة فتح إعدادات التطبيق');
      
      // إذا لم نكن في منصة جوال حقيقية، نعرض رسالة فقط
      if (!Capacitor.isNativePlatform()) {
        console.log('[AppSettingsOpener] لسنا في بيئة جوال، إظهار رسالة فقط');
        await Toast.show({
          text: 'في بيئة الويب، يرجى تفعيل إذن الكاميرا من إعدادات المتصفح',
          duration: 'long'
        });
        return false;
      }
      
      const platform = Capacitor.getPlatform();
      console.log(`[AppSettingsOpener] المنصة الحالية: ${platform}`);
      
      // فتح إعدادات التطبيق على نظام iOS
      if (platform === 'ios') {
        await Browser.open({
          url: 'app-settings:'
        });
        return true;
      }
      
      // فتح إعدادات التطبيق على نظام Android
      if (platform === 'android') {
        const appInfo = await App.getInfo();
        console.log(`[AppSettingsOpener] معلومات التطبيق: ${JSON.stringify(appInfo)}`);
        
        // Using Browser.open for opening app settings
        await Browser.open({
          url: `package:${appInfo.id}`
        });
        return true;
      }
      
      // عرض رسالة توضيحية في حالة عدم دعم المنصة
      await Toast.show({
        text: 'يرجى فتح إعدادات الجهاز وتمكين إذن الكاميرا للتطبيق يدوياً',
        duration: 'long'
      });
      
      return false;
    } catch (error) {
      console.error('[AppSettingsOpener] خطأ في فتح إعدادات التطبيق:', error);
      
      // عرض رسالة خطأ للمستخدم
      await Toast.show({
        text: 'تعذر فتح إعدادات التطبيق، يرجى فتحها يدوياً وتمكين إذن الكاميرا',
        duration: 'long'
      });
      
      return false;
    }
  }
}
