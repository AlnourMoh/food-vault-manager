
import { useState } from 'react';
import { Toast } from '@capacitor/toast';
import { App } from '@capacitor/app';

export const useScannerPermissionHandlers = (
  requestPermission: () => Promise<boolean>,
  openAppSettings: () => Promise<boolean>
) => {
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const handleRequestPermission = async (): Promise<void> => {
    console.log('ScanProductContent: محاولة طلب إذن الكاميرا...');
    try {
      // عرض رسالة توضيحية
      await Toast.show({
        text: 'جاري طلب إذن الكاميرا...',
        duration: 'short'
      });
      
      const granted = await requestPermission();
      
      if (granted) {
        console.log('ScanProductContent: تم منح الإذن بنجاح');
        setPermissionError(null);
        
        // إعلام المستخدم
        await Toast.show({
          text: 'تم منح إذن الكاميرا بنجاح!',
          duration: 'short'
        });
      } else {
        console.log('ScanProductContent: لم يتم منح الإذن');
        setPermissionError("تم رفض إذن الكاميرا، يرجى السماح بالوصول من إعدادات جهازك");
        
        // تجربة فتح الإعدادات بعد فشل الطلب
        await Toast.show({
          text: 'لم يتم منح إذن الكاميرا. سيتم توجيهك إلى الإعدادات.',
          duration: 'short'
        });
        
        // تأخير قصير قبل فتح الإعدادات
        setTimeout(() => handleOpenSettings(), 1000);
      }
    } catch (error) {
      console.error('ScanProductContent: خطأ في طلب إذن الكاميرا:', error);
      setPermissionError("حدث خطأ أثناء طلب إذن الكاميرا");
      
      // محاولة أخيرة للتعامل مع الخطأ
      try {
        const platform = window.Capacitor?.getPlatform();
        const message = platform === 'ios' 
          ? 'يرجى فتح إعدادات جهازك > الخصوصية > الكاميرا لتمكين الإذن' 
          : 'يرجى فتح إعدادات التطبيق > الأذونات لتمكين الكاميرا';
          
        await Toast.show({
          text: message,
          duration: 'long'
        });
      } catch (e) {
        console.error('ScanProductContent: خطأ في عرض الرسالة:', e);
        alert('يرجى تمكين إذن الكاميرا يدويًا من إعدادات جهازك');
      }
    }
  };
  
  const handleOpenSettings = async (): Promise<void> => {
    try {
      console.log('ScanProductContent: محاولة فتح إعدادات التطبيق...');
      
      // محاولة فتح الإعدادات
      const opened = await openAppSettings();
      
      if (!opened) {
        // إرشاد المستخدم لفتح الإعدادات يدويًا
        const platform = window.Capacitor?.getPlatform();
        const message = platform === 'ios' 
          ? 'يرجى فتح إعدادات جهازك > الخصوصية > الكاميرا لتمكين الإذن' 
          : 'يرجى فتح إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات';
          
        await Toast.show({
          text: message,
          duration: 'long'
        });
      }
    } catch (error) {
      console.error('ScanProductContent: خطأ في فتح الإعدادات:', error);
      
      // إرشاد المستخدم لفتح الإعدادات يدويًا مع معلومات تفصيلية
      const platformText = window.Capacitor?.getPlatform() === 'ios' 
        ? 'فتح الإعدادات > الخصوصية > الكاميرا > تطبيق مخزن الطعام' 
        : 'فتح الإعدادات > التطبيقات > مخزن الطعام > الأذونات';
      
      await Toast.show({
        text: `يرجى ${platformText} لتمكين إذن الكاميرا`,
        duration: 'long'
      });
    }
  };
  
  return {
    permissionError,
    setPermissionError,
    handleRequestPermission,
    handleOpenSettings
  };
};
