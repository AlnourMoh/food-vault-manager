
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
      console.log('AppSettingsOpener: المنصة الحالية:', platform);
      
      if (platform === 'android') {
        // على Android، نفتح إعدادات التطبيق باستخدام نية مخصصة
        const appInfo = await App.getInfo();
        console.log('AppSettingsOpener: معلومات التطبيق:', appInfo);
        
        // عرض رسالة للمستخدم
        await Toast.show({
          text: 'سيتم فتح إعدادات التطبيق. يرجى تفعيل أذونات الكاميرا',
          duration: 'long'
        });
        
        // فتح إعدادات التطبيق الخاصة
        await Browser.open({
          url: `package:${appInfo.id}`
        });
        
        // فتح إعدادات الكاميرا مباشرة إذا كانت متاحة (محاولة ثانية)
        try {
          await Browser.open({
            url: 'package:com.android.settings/.applications.InstalledAppDetailsSettings'
          });
        } catch (e) {
          console.log('AppSettingsOpener: لا يمكن فتح إعدادات التطبيق المفصلة:', e);
        }
        
        return true;
      } else if (platform === 'ios') {
        // على iOS، نفتح إعدادات التطبيق باستخدام URL مخصص
        console.log('AppSettingsOpener: فتح إعدادات iOS');
        
        // عرض رسالة للمستخدم
        await Toast.show({
          text: 'سيتم فتح إعدادات التطبيق. يرجى تفعيل أذونات الكاميرا',
          duration: 'long'
        });
        
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
        } else {
          // في بيئة الويب
          await Toast.show({
            text: 'يرجى السماح للكاميرا من إعدادات المتصفح',
            duration: 'long'
          });
        }
        
        return false;
      }
    } catch (error) {
      console.error('AppSettingsOpener: خطأ في فتح إعدادات التطبيق', error);
      
      // محاولة بديلة في حالة الفشل
      try {
        await Toast.show({
          text: 'يرجى فتح إعدادات جهازك يدويًا وتمكين أذونات الكاميرا للتطبيق',
          duration: 'long'
        });
      } catch (e) {
        console.error('AppSettingsOpener: خطأ في عرض الرسالة', e);
      }
      
      return false;
    }
  }
}
