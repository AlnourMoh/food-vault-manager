
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';

export const usePlatformPermissions = () => {
  const { toast } = useToast();

  const handleIosPermissions = async () => {
    console.log('[usePlatformPermissions] معالجة أذونات iOS');
    try {
      // تنبيه المستخدم بالحاجة إلى تمكين الإذن من إعدادات النظام
      const confirm = window.confirm(
        "يجب تفعيل إذن الكاميرا من إعدادات الجهاز.\n\n" +
        "1. انتقل إلى إعدادات جهازك\n" +
        "2. اختر 'الخصوصية والأمان'\n" +
        "3. اختر 'الكاميرا'\n" +
        "4. ابحث عن تطبيق 'مخزن الطعام' وقم بتفعيله\n\n" +
        "هل تريد الانتقال إلى الإعدادات الآن؟"
      );
      
      if (confirm) {
        console.log('[usePlatformPermissions] المستخدم وافق على الانتقال إلى الإعدادات');
        // على iOS، استخدام الطريقة الصحيحة لفتح الإعدادات
        if (Capacitor.isPluginAvailable('App')) {
          // استخدام الطريقة المتوافقة مع إصدار Capacitor الحالي
          await App.exitApp();
        }
      }
    } catch (error) {
      console.error('[usePlatformPermissions] خطأ في معالجة أذونات iOS:', error);
    }
    return false;
  };

  const handleAndroidPermissions = async () => {
    console.log('[usePlatformPermissions] معالجة أذونات Android');
    try {
      // على Android، نقدم خيار الذهاب إلى إعدادات التطبيق مباشرة
      const confirm = window.confirm(
        "يجب تفعيل إذن الكاميرا من إعدادات التطبيق.\n\n" +
        "1. انتقل إلى إعدادات جهازك\n" +
        "2. اختر 'التطبيقات' أو 'مدير التطبيقات'\n" +
        "3. ابحث عن تطبيق 'مخزن الطعام'\n" +
        "4. اختر 'الأذونات'\n" +
        "5. قم بتفعيل إذن 'الكاميرا'\n\n" +
        "هل تريد الانتقال إلى إعدادات التطبيق الآن؟"
      );
      
      if (confirm) {
        console.log('[usePlatformPermissions] المستخدم وافق على الانتقال إلى إعدادات التطبيق');
        // فتح إعدادات التطبيق مباشرة على Android
        if (Capacitor.isPluginAvailable('App')) {
          // استخدام الطريقة الصحيحة للخروج من التطبيق بدلاً من openUrl
          await App.exitApp();
        }
      }
    } catch (error) {
      console.error('[usePlatformPermissions] خطأ في معالجة أذونات Android:', error);
    }
    return false;
  };

  const handleWebPermissions = async () => {
    console.log('[usePlatformPermissions] طلب أذونات الويب للكاميرا');
    
    try {
      // في بيئة الويب، سنعتبر الإذن ممنوح دائمًا
      // ولكن سنعرض رسالة للمستخدم لتوجيهه
      toast({
        title: "إذن الكاميرا",
        description: "سيطلب المتصفح منك السماح بالوصول إلى الكاميرا عند بدء المسح",
      });
      
      // إذا كنا في بيئة المحاكاة
      return true;
    } catch (error) {
      console.error('[usePlatformPermissions] خطأ في طلب إذن الكاميرا للويب:', error);
      return false;
    }
  };

  return {
    handleIosPermissions,
    handleAndroidPermissions,
    handleWebPermissions
  };
};
