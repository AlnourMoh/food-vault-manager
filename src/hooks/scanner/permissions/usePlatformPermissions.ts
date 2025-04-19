
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
    console.log('Handling iOS camera permissions request');
    // بالنسبة لـ iOS، نحتاج إلى توجيه المستخدم إلى الإعدادات نظرًا لأن iOS لا يوفر وصولًا مباشرًا للإعدادات
    const confirm = window.confirm("يجب تفعيل إذن الكاميرا من إعدادات الجهاز. هل تريد فتح إعدادات التطبيق لتمكين إذن الكاميرا؟");
    if (confirm) {
      console.log('User confirmed, opening app settings');
      try {
        // عند إعادة فتح التطبيق، سيطلب iOS فتح الإعدادات
        await App.exitApp();
      } catch (error) {
        console.error('Error exiting app to open settings:', error);
      }
    } else {
      console.log('User declined to open settings');
    }
    return false;
  };

  /**
   * يتعامل مع طلبات الإذن الخاصة بـ Android
   * على Android، نحتاج إلى عرض تعليمات لتمكين الأذونات يدويًا
   */
  const handleAndroidPermissions = () => {
    console.log('Handling Android camera permissions request');
    // بالنسبة لـ Android، نعرض تعليمات مفصلة لتوجيه المستخدم إلى إعدادات التطبيق
    alert("لتمكين إذن الكاميرا، يرجى اتباع الخطوات التالية:\n1. افتح إعدادات جهازك\n2. اختر التطبيقات\n3. ابحث عن تطبيق مخزن الطعام\n4. اختر الأذونات\n5. قم بتفعيل إذن الكاميرا");
    return false;
  };

  /**
   * يتعامل مع طلبات الإذن الخاصة بالويب
   * على الويب، نحاول طلب الوصول إلى الكاميرا عبر واجهة برمجة التطبيقات في المتصفح
   */
  const handleWebPermissions = async () => {
    console.log('Handling Web camera permissions request');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        console.log('Requesting camera access via mediaDevices API');
        // طلب الوصول إلى الكاميرا - سيؤدي هذا إلى تشغيل مربع حوار إذن المتصفح
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (stream) {
          console.log('Camera access granted, stopping stream');
          // تنظيف الدفق بعد منح الإذن
          stream.getTracks().forEach(track => track.stop());
        }
        return true;
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        return false;
      }
    }
    console.log('MediaDevices API not available, assuming permission granted for testing');
    return true; // التراجع للاختبار
  };

  return {
    handleIosPermissions,
    handleAndroidPermissions,
    handleWebPermissions
  };
};
