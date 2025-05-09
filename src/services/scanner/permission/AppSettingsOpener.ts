
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

export class AppSettingsOpener {
  /**
   * فتح إعدادات التطبيق
   */
  public async openSettings(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        console.log('AppSettingsOpener: محاولة فتح إعدادات التطبيق...');
        
        // التحقق من وجود الدالة في الإصدارات المختلفة من Capacitor
        const appSettings = App as any;
        if (typeof appSettings.openSettings === 'function') {
          await appSettings.openSettings();
          return true;
        } else {
          console.warn('AppSettingsOpener: دالة فتح الإعدادات غير متوفرة في هذا الإصدار من Capacitor');
          await Toast.show({
            text: 'يرجى فتح إعدادات جهازك يدوياً وتمكين إذن الكاميرا',
            duration: 'long'
          });
          return false;
        }
      } else {
        console.log('AppSettingsOpener: غير قادر على فتح الإعدادات في بيئة الويب');
        await Toast.show({
          text: 'يرجى تمكين إذن الكاميرا من إعدادات المتصفح',
          duration: 'long'
        });
        return false;
      }
    } catch (error) {
      console.error('AppSettingsOpener: خطأ في فتح إعدادات التطبيق:', error);
      return false;
    }
  }
}
