
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

export const useAppSettings = () => {
  const openAppSettings = async (): Promise<boolean> => {
    try {
      console.log("جاري محاولة فتح إعدادات التطبيق...");
      
      // المنصة الحالية
      const platform = Capacitor.getPlatform();
      console.log("المنصة الحالية:", platform);
      
      // على نظام Android
      if (platform === 'android') {
        await Browser.open({
          url: 'package:' + App.getId()
        });
        return true;
      } 
      // على نظام iOS
      else if (platform === 'ios') {
        await Browser.open({
          url: 'app-settings:'
        });
        return true;
      } 
      // في بيئة الويب أو منصات أخرى
      else {
        console.log("لا يمكن فتح الإعدادات على هذه المنصة:", platform);
        await Toast.show({
          text: 'يرجى تفعيل إذن الكاميرا من إعدادات المتصفح',
          duration: 'long'
        });
        return false;
      }
    } catch (error) {
      console.error("خطأ في فتح إعدادات التطبيق:", error);
      await Toast.show({
        text: 'تعذر فتح إعدادات التطبيق، يرجى فتحها يدوياً',
        duration: 'long'
      });
      return false;
    }
  };

  return { openAppSettings };
};
