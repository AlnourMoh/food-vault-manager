
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
    console.log('AppSettingsOpener: على منصة أندرويد');
    
    // عرض رسالة توجيهية للمستخدم
    await Toast.show({
      text: 'سيتم توجيهك للإعدادات، يرجى البحث عن التطبيق وتمكين إذن الكاميرا',
      duration: 'long'
    });
    
    try {
      // محاولة الطريقة الأولى - استخدام الرابط المباشر
      const packageName = 'app.lovable.foodvault.manager';
      const url = `package:${packageName}`;
      
      // استخدام متصفح Capacitor لفتح URL الخاص
      await Browser.open({
        url: `intent:${url}#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;end`
      });
      
      return true;
    } catch (err1) {
      console.log('AppSettingsOpener: فشلت الطريقة الأولى، محاولة الطريقة الثانية');
      
      try {
        // محاولة الطريقة الثانية - فتح الإعدادات العامة
        await Browser.open({
          url: 'intent:#Intent;action=android.settings.APPLICATION_SETTINGS;end'
        });
        
        // إظهار إرشادات إضافية
        await Toast.show({
          text: 'يرجى اختيار "التطبيقات" ثم البحث عن "مخزن الطعام" وتمكين الكاميرا',
          duration: 'long'
        });
        
        return true;
      } catch (err2) {
        console.error('AppSettingsOpener: فشلت محاولات فتح الإعدادات', err2);
        
        // إظهار إرشادات يدوية
        await Toast.show({
          text: 'يرجى فتح "إعدادات" الجهاز > التطبيقات > مخزن الطعام > الأذونات',
          duration: 'long'
        });
        
        return false;
      }
    }
  }

  /**
   * فتح إعدادات الأذونات في iOS
   */
  private static async openIOSSettings(): Promise<boolean> {
    console.log('AppSettingsOpener: على منصة iOS');
    
    // على iOS لا يمكن فتح إعدادات تطبيق محدد مباشرة، فقط الإعدادات العامة
    await Toast.show({
      text: 'يرجى فتح إعدادات الجهاز > الخصوصية > الكاميرا، وتمكين إذن الكاميرا للتطبيق',
      duration: 'long'
    });
    
    // محاولة فتح الإعدادات العامة
    try {
      await Browser.open({
        url: 'App-prefs:root'
      });
      
      return true;
    } catch (error) {
      console.error('AppSettingsOpener: فشل في فتح إعدادات iOS', error);
      return false;
    }
  }

  /**
   * فتح إعدادات المتصفح في الويب
   */
  private static async openWebSettings(): Promise<boolean> {
    console.log('AppSettingsOpener: على منصة الويب');
    
    // في بيئة الويب، نقدم إرشادات لإعدادات المتصفح
    await Toast.show({
      text: 'يرجى السماح بإذن الكاميرا عند ظهور النافذة المنبثقة من المتصفح',
      duration: 'long'
    });
    
    return true;
  }
}
