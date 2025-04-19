
import { App } from '@capacitor/app';

/**
 * Hook للتعامل مع طلبات الإذن الخاصة بالمنصات المختلفة
 * يوفر معالجة متخصصة لبيئات iOS و Android والويب
 */
export const usePlatformPermissions = () => {
  /**
   * يتعامل مع طلبات الإذن الخاصة بـ iOS
   * على iOS، نحتاج إلى توجيه المستخدم لفتح الإعدادات يدويًا
   */
  const handleIosPermissions = async () => {
    console.log('[usePlatformPermissions] طلب أذونات iOS للكاميرا');
    try {
      // بالنسبة لـ iOS، نحتاج إلى توجيه المستخدم إلى الإعدادات
      const confirm = window.confirm("يجب تفعيل إذن الكاميرا من إعدادات الجهاز.\n\nتأكد من البحث عن تطبيق 'مخزن الطعام' في قائمة التطبيقات في الإعدادات.\n\nهل تريد فتح إعدادات التطبيق لتمكين إذن الكاميرا؟");
      if (confirm) {
        console.log('[usePlatformPermissions] المستخدم وافق، جاري فتح إعدادات التطبيق');
        try {
          // على iOS، هذا سيقترح فتح الإعدادات عند إعادة فتح التطبيق
          await App.exitApp();
        } catch (error) {
          console.error('[usePlatformPermissions] خطأ في الخروج من التطبيق لفتح الإعدادات:', error);
          alert("يرجى فتح إعدادات جهازك يدويًا وتمكين إذن الكاميرا لتطبيق 'مخزن الطعام'");
        }
      } else {
        console.log('[usePlatformPermissions] رفض المستخدم فتح الإعدادات');
      }
    } catch (error) {
      console.error('[usePlatformPermissions] خطأ في معالجة أذونات iOS:', error);
    }
    return false;
  };

  /**
   * يتعامل مع طلبات الإذن الخاصة بـ Android
   * على Android، نحتاج إلى عرض تعليمات تفصيلية لتمكين الأذونات يدويًا
   */
  const handleAndroidPermissions = () => {
    console.log('[usePlatformPermissions] طلب أذونات Android للكاميرا');
    try {
      // بالنسبة لـ Android، نعرض تعليمات مفصلة
      alert("لتمكين إذن الكاميرا، يرجى اتباع الخطوات التالية:\n\n" + 
            "1. افتح إعدادات جهازك\n" + 
            "2. اختر 'التطبيقات' أو 'إدارة التطبيقات'\n" + 
            "3. ابحث عن تطبيق 'مخزن الطعام'\n" + 
            "   (إذا لم تجده، انتقل إلى 'عرض كل التطبيقات' أو 'جميع التطبيقات')\n" + 
            "4. اختر 'الأذونات'\n" + 
            "5. قم بتفعيل إذن 'الكاميرا'\n\n" +
            "ملاحظة: بعض أجهزة Android قد تخفي بعض التطبيقات. تأكد من البحث في قائمة 'جميع التطبيقات'.");
    } catch (error) {
      console.error('[usePlatformPermissions] خطأ في معالجة أذونات Android:', error);
    }
    return false;
  };

  /**
   * يتعامل مع طلبات الإذن الخاصة بالويب
   * على الويب، نحاول طلب الوصول إلى الكاميرا عبر واجهة برمجة التطبيقات في المتصفح
   */
  const handleWebPermissions = async () => {
    console.log('[usePlatformPermissions] طلب أذونات الويب للكاميرا');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        console.log('[usePlatformPermissions] طلب الوصول إلى الكاميرا عبر واجهة mediaDevices');
        // طلب الوصول إلى الكاميرا - سيؤدي هذا إلى تشغيل مربع حوار إذن المتصفح
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (stream) {
          console.log('[usePlatformPermissions] تم منح إذن الكاميرا، إيقاف التدفق');
          // تنظيف الدفق بعد منح الإذن
          stream.getTracks().forEach(track => track.stop());
        }
        return true;
      } catch (error) {
        console.error('[usePlatformPermissions] خطأ في طلب إذن الكاميرا:', error);
        return false;
      }
    }
    console.log('[usePlatformPermissions] واجهة MediaDevices غير متوفرة، افتراض منح الإذن للاختبار');
    return true; // التراجع للاختبار
  };

  return {
    handleIosPermissions,
    handleAndroidPermissions,
    handleWebPermissions
  };
};
