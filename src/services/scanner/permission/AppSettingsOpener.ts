
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';

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
        console.log('AppSettingsOpener: على منصة أندرويد');
        
        // عرض رسالة توجيهية للمستخدم
        await Toast.show({
          text: 'سيتم توجيهك للإعدادات، يرجى البحث عن التطبيق وتمكين إذن الكاميرا',
          duration: 'long'
        });
        
        // استخدام الطريقة البسيطة لإخبار المستخدم بالخطوات المطلوبة
        // وإعطائه وقت للقراءة قبل فتح شاشة الإعدادات
        setTimeout(async () => {
          try {
            // محاولة فتح نشاط إعدادات الأذونات عن طريق البراوزر
            const url = 'package:app.lovable.foodvault.manager';
            await window.open(`intent:${url}#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;end`, '_system');
            
            // إضافة تأخير قبل إغلاق التطبيق لضمان فتح الإعدادات
            setTimeout(() => {
              // نترك التطبيق لفترة حتى يتمكن المستخدم من تعديل الإعدادات
              App.exitApp();
            }, 1000);
            
            return true;
          } catch (err) {
            console.error('AppSettingsOpener: خطأ في فتح الإعدادات', err);
            
            // محاولة بديلة في حالة الخطأ - إخبار المستخدم بالخطوات اليدوية
            await Toast.show({
              text: 'يرجى فتح إعدادات الجهاز > التطبيقات > مخزن الطعام > الأذونات وتمكين إذن الكاميرا',
              duration: 'long'
            });
            
            return false;
          }
        }, 2000);
        
        return true;
      } else if (platform === 'ios') {
        console.log('AppSettingsOpener: على منصة iOS');
        
        // على iOS الأمر أبسط لكن لا يمكن فتح الإعدادات مباشرة
        await Toast.show({
          text: 'يرجى فتح إعدادات الجهاز > الخصوصية > الكاميرا، وتمكين إذن الكاميرا للتطبيق',
          duration: 'long'
        });
        
        return true;
      } else {
        // في بيئة الويب
        console.log('AppSettingsOpener: على منصة الويب');
        
        await Toast.show({
          text: 'يرجى السماح بإذن الكاميرا عند ظهور النافذة المنبثقة من المتصفح',
          duration: 'long'
        });
        
        return true;
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
}
