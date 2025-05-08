
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export const useAppSettings = () => {
  const openAppSettings = async () => {
    try {
      console.log("جاري محاولة فتح إعدادات التطبيق...");
      
      // عرض رسالة توضيحية
      await Toast.show({
        text: 'سيتم توجيهك إلى إعدادات التطبيق لتمكين الكاميرا',
        duration: 'short'
      });
      
      // المحاولة الأولى: استخدام MLKitBarcodeScanner إذا كان متاحًا
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log("استخدام MLKitBarcodeScanner لفتح الإعدادات");
        await BarcodeScanner.openSettings();
        return true;
      }
      
      // طرق تحديد المنصة
      const platform = window.Capacitor?.getPlatform();
      
      if (platform === 'android') {
        // محاولة فتح صفحة معلومات التطبيق
        console.log("محاولة إرشاد المستخدم لفتح إعدادات أندرويد");
        await Toast.show({
          text: 'يرجى تمكين إذن الكاميرا في إعدادات > التطبيقات > مخزن الطعام > الأذونات',
          duration: 'long'
        });
        
        // على Android يمكننا المحاولة باستخدام ملحق App للخروج وإرشاد المستخدم
        setTimeout(() => App.exitApp(), 3000);
        return true;
      } else if (platform === 'ios') {
        console.log("محاولة إرشاد المستخدم لفتح إعدادات آيفون");
        await Toast.show({
          text: 'يرجى فتح إعدادات الجهاز > الخصوصية > الكاميرا، وابحث عن التطبيق لتمكين الإذن',
          duration: 'long'
        });
        
        // على iOS لا يمكننا فتح الإعدادات مباشرة، نرشد المستخدم فقط
        return true;
      }
      
      // في حالة عدم التعرف على المنصة
      console.log("منصة غير معروفة، عرض إرشادات عامة");
      await Toast.show({
        text: 'يرجى فتح إعدادات جهازك وتمكين إذن الكاميرا للتطبيق',
        duration: 'long'
      });
      return true;
    } catch (error) {
      console.error("خطأ في فتح الإعدادات:", error);
      
      // في حالة الخطأ نعرض رسالة إرشادية للمستخدم
      await Toast.show({
        text: 'يرجى فتح إعدادات جهازك يدوياً وتمكين إذن الكاميرا للتطبيق',
        duration: 'long'
      });
      return false;
    }
  };

  return { openAppSettings };
};
