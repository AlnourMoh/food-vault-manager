
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';
import { Browser } from '@capacitor/browser';

/**
 * خدمة فتح إعدادات التطبيق للوصول إلى أذونات الكاميرا
 */
export class AppSettingsOpener {
  /**
   * محاولة فتح إعدادات أذونات التطبيق
   */
  public static async openAppSettings(): Promise<boolean> {
    try {
      console.log('AppSettingsOpener: محاولة فتح إعدادات التطبيق');
      
      // عرض رسالة توضيحية للمستخدم
      await Toast.show({
        text: 'يرجى تمكين إذن الكاميرا من إعدادات التطبيق',
        duration: 'long'
      });
      
      // تحديد المنصة
      const platform = Capacitor.getPlatform();
      console.log('AppSettingsOpener: المنصة المحددة:', platform);
      
      if (platform === 'android') {
        return await this.openAndroidSettings();
      } else if (platform === 'ios') {
        return await this.openIOSSettings();
      } else {
        // في بيئة الويب
        return await this.openWebSettings();
      }
    } catch (error) {
      console.error('AppSettingsOpener: خطأ في فتح إعدادات التطبيق:', error);
      
      // في حالة الفشل، نعرض رسالة إرشادية للمستخدم
      await Toast.show({
        text: 'يرجى فتح إعدادات جهازك يدوياً وتمكين إذن الكاميرا للتطبيق',
        duration: 'long'
      });
      
      return false;
    }
  }

  /**
   * فتح إعدادات الأذونات في أندرويد
   */
  private static async openAndroidSettings(): Promise<boolean> {
    console.log('AppSettingsOpener: فتح إعدادات أندرويد');
    
    try {
      // ننشئ نافذة تأكيد للمستخدم
      const result = confirm(
        "هل تريد الانتقال إلى إعدادات التطبيق لتمكين إذن الكاميرا؟\n" +
        "\nخطوات تفعيل الإذن في جهازك:" +
        "\n1. انتقل إلى التطبيقات في الإعدادات" +
        "\n2. ابحث عن تطبيق 'مخزن الطعام'" +
        "\n3. اختر 'الأذونات'" +
        "\n4. قم بتمكين 'الكاميرا'"
      );
      
      if (result) {
        console.log('AppSettingsOpener: المستخدم وافق على فتح الإعدادات');
        
        // محاولة استخدام ملحق App لفتح الإعدادات أولاً
        if (Capacitor.isPluginAvailable('App')) {
          try {
            await App.openUrl({
              url: 'package:app.lovable.foodvault.manager'
            });
            return true;
          } catch (error) {
            console.log('AppSettingsOpener: فشل فتح الإعدادات باستخدام App، تجربة البدائل');
          }
        }

        // محاولة استخدام متصفح Capacitor كبديل
        try {
          await Browser.open({
            url: 'package:app.lovable.foodvault.manager'
          });
          return true;
        } catch (error) {
          console.log('AppSettingsOpener: فشل فتح الإعدادات باستخدام Browser');
        }
        
        // عرض توجيهات للمستخدم
        await Toast.show({
          text: 'يرجى فتح إعدادات الجهاز يدوياً وتفعيل إذن الكاميرا للتطبيق',
          duration: 'long'
        });
      }
      
      return false;
    } catch (error) {
      console.error('AppSettingsOpener: خطأ في فتح إعدادات أندرويد:', error);
      return false;
    }
  }

  /**
   * فتح إعدادات الأذونات في iOS
   */
  private static async openIOSSettings(): Promise<boolean> {
    console.log('AppSettingsOpener: فتح إعدادات iOS');
    
    try {
      // ننشئ نافذة تأكيد للمستخدم
      const result = confirm(
        "هل تريد الانتقال إلى إعدادات التطبيق لتمكين إذن الكاميرا؟\n" +
        "\nخطوات تفعيل الإذن في جهازك:" +
        "\n1. انتقل إلى الإعدادات" +
        "\n2. اختر 'الخصوصية والأمان'" +
        "\n3. اختر 'الكاميرا'" +
        "\n4. قم بتمكين 'مخزن الطعام'"
      );
      
      if (result) {
        console.log('AppSettingsOpener: المستخدم وافق على فتح الإعدادات');
        
        // محاولة استخدام ملحق App لفتح الإعدادات أولاً
        if (Capacitor.isPluginAvailable('App')) {
          try {
            await App.openUrl({
              url: 'app-settings:'
            });
            return true;
          } catch (error) {
            console.log('AppSettingsOpener: فشل فتح الإعدادات باستخدام App، تجربة البدائل');
          }
        }

        // محاولة استخدام Browser كبديل
        try {
          await Browser.open({
            url: 'app-settings:'
          });
          return true;
        } catch (error) {
          console.log('AppSettingsOpener: فشل فتح الإعدادات باستخدام Browser');
        }
        
        // عرض توجيهات للمستخدم
        await Toast.show({
          text: 'يرجى فتح إعدادات الجهاز يدوياً وتفعيل إذن الكاميرا للتطبيق',
          duration: 'long'
        });
      }
      
      return false;
    } catch (error) {
      console.error('AppSettingsOpener: خطأ في فتح إعدادات iOS:', error);
      return false;
    }
  }

  /**
   * فتح إعدادات المتصفح في الويب
   */
  private static async openWebSettings(): Promise<boolean> {
    console.log('AppSettingsOpener: في بيئة الويب');
    
    try {
      // إظهار إرشادات للمستخدم
      alert(
        "لتمكين إذن الكاميرا في المتصفح:\n\n" +
        "1. انقر على أيقونة القفل/معلومات بجوار عنوان URL\n" +
        "2. اختر 'إعدادات الموقع' أو 'أذونات'\n" +
        "3. قم بتمكين 'الكاميرا'\n\n" +
        "أو افتح إعدادات المتصفح وابحث عن أذونات المواقع"
      );
      
      // إظهار رسالة توضيحية
      await Toast.show({
        text: 'يرجى السماح بإذن الكاميرا من إعدادات المتصفح',
        duration: 'long'
      });
      
      return true;
    } catch (error) {
      console.error('AppSettingsOpener: خطأ في فتح إعدادات الويب:', error);
      return false;
    }
  }
}
