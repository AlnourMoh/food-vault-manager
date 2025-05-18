
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';

export const useAppSettings = () => {
  const openAppSettings = async (): Promise<boolean> => {
    try {
      console.log('[useAppSettings] محاولة فتح إعدادات التطبيق...');
      
      if (Capacitor.isNativePlatform()) {
        const platform = Capacitor.getPlatform();
        
        // عرض رسالة توضيحية للمستخدم
        await Toast.show({
          text: 'يتم توجيهك لإعدادات التطبيق لتمكين إذن الكاميرا',
          duration: 'short'
        }).catch(() => {});
        
        // استخدام واجهة برمجة التطبيق لفتح الإعدادات
        if (platform === 'ios' || platform === 'android') {
          // استخدام exitApp بدلا من openUrl
          await App.exitApp();
          return true;
        }
      }
      
      // عرض رسالة للمستخدم عن كيفية الوصول للإعدادات يدوياً
      await Toast.show({
        text: 'يرجى فتح إعدادات جهازك وتمكين إذن الكاميرا لهذا التطبيق',
        duration: 'long'
      }).catch(() => {});
      
      return false;
    } catch (error) {
      console.error('[useAppSettings] خطأ في فتح الإعدادات:', error);
      return false;
    }
  };

  return { openAppSettings };
};
