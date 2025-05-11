
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

/**
 * خدمة فتح إعدادات التطبيق
 */
export class AppSettingsOpener {
  /**
   * فتح إعدادات التطبيق
   */
  public static async openAppSettings(): Promise<boolean> {
    try {
      console.log('[AppSettingsOpener] محاولة فتح إعدادات التطبيق');
      
      // على المنصات غير المحمولة
      if (!Capacitor.isNativePlatform()) {
        console.log('[AppSettingsOpener] ليست منصة محمولة، لا يمكن فتح الإعدادات');
        await Toast.show({
          text: 'يرجى فتح إعدادات المتصفح لتمكين إذن الكاميرا',
          duration: 'long'
        });
        return false;
      }
      
      // عرض رسالة توضيحية
      await Toast.show({
        text: 'سيتم توجيهك إلى إعدادات التطبيق لتمكين إذن الكاميرا',
        duration: 'short'
      });
      
      const platform = Capacitor.getPlatform();
      console.log('[AppSettingsOpener] المنصة:', platform);
      
      // على نظام Android
      if (platform === 'android') {
        try {
          // استخدام BarcodeScanner إذا أمكن
          if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
            // @ts-ignore: Calling openSettings method
            const BarcodeScanner = require('@capacitor-mlkit/barcode-scanning').BarcodeScanner;
            if (typeof BarcodeScanner.openSettings === 'function') {
              await BarcodeScanner.openSettings();
              return true;
            }
          }
          
          // طريقة بديلة باستخدام معرف التطبيق
          const appInfo = await App.getInfo();
          await Browser.open({
            url: 'package:' + appInfo.id
          });
          return true;
        } catch (error) {
          console.error('[AppSettingsOpener] خطأ في فتح الإعدادات على Android:', error);
        }
      } 
      // على نظام iOS
      else if (platform === 'ios') {
        try {
          await Browser.open({
            url: 'app-settings:'
          });
          return true;
        } catch (error) {
          console.error('[AppSettingsOpener] خطأ في فتح الإعدادات على iOS:', error);
        }
      }
      
      // في حال فشل الطرق السابقة، عرض رسالة إرشادية
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
