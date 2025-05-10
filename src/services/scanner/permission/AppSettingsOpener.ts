
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Device } from '@capacitor/device';

export class AppSettingsOpener {
  /**
   * فتح إعدادات التطبيق للسماح للمستخدم بمنح الأذونات
   */
  public static async openAppSettings(): Promise<boolean> {
    try {
      console.log('AppSettingsOpener: محاولة فتح إعدادات التطبيق');
      
      // إذا لم نكن في بيئة تطبيق حقيقية
      if (!Capacitor.isNativePlatform()) {
        console.log('AppSettingsOpener: لسنا في تطبيق جوال، توجيه المستخدم إلى إعدادات المتصفح');
        
        await Toast.show({
          text: 'يرجى تمكين أذونات الكاميرا من خلال إعدادات المتصفح',
          duration: 'long'
        });
        
        return false;
      }
      
      // محاولة فتح الإعدادات باستخدام BarcodeScanner أولاً
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('AppSettingsOpener: استخدام MLKitBarcodeScanner.openSettings()');
        await BarcodeScanner.openSettings();
        return true;
      }
      
      // محاولة استخدام App.openUrl لفتح إعدادات التطبيق
      const platform = Capacitor.getPlatform();
      console.log('AppSettingsOpener: المنصة:', platform);
      
      // تحديد رسالة حسب المنصة
      let message = '';
      if (platform === 'ios') {
        message = 'انتقل إلى: الإعدادات > الخصوصية > الكاميرا > (اسم التطبيق)';
      } else {
        message = 'انتقل إلى: الإعدادات > التطبيقات > (اسم التطبيق) > الأذونات';
      }
      
      // عرض رسالة توضيحية
      await Toast.show({
        text: `سيتم توجيهك إلى إعدادات التطبيق. ${message}`,
        duration: 'long'
      });
      
      // الحصول على معلومات الجهاز
      const deviceInfo = await Device.getInfo();
      
      // بناء رابط إعدادات التطبيق حسب المنصة
      let settingsUrl: string;
      
      if (platform === 'ios') {
        // على iOS، نفتح إعدادات التطبيق مباشرة
        settingsUrl = 'app-settings:';
      } else if (platform === 'android') {
        // على Android، نستخدم نية محددة لفتح إعدادات التطبيق
        const packageName = 'app.lovable.foodvault.manager';
        
        // تغيير المسار حسب إصدار Android
        if (deviceInfo.osVersion && parseInt(deviceInfo.osVersion) >= 9) {
          settingsUrl = `package:${packageName}`;
        } else {
          settingsUrl = `package:${packageName}`;
        }
      } else {
        console.log('AppSettingsOpener: المنصة غير مدعومة');
        return false;
      }
      
      // محاولة فتح الرابط
      console.log('AppSettingsOpener: محاولة فتح الرابط:', settingsUrl);
      await App.openUrl({ url: settingsUrl });
      
      return true;
    } catch (error) {
      console.error('AppSettingsOpener: خطأ في فتح إعدادات التطبيق:', error);
      
      // عرض رسالة خطأ
      await Toast.show({
        text: 'تعذر فتح إعدادات التطبيق تلقائيًا. يرجى فتح إعدادات جهازك يدويًا وتمكين إذن الكاميرا للتطبيق',
        duration: 'long'
      });
      
      return false;
    }
  }
}
