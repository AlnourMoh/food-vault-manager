
import { useState, useEffect } from 'react';
import { Toast } from '@capacitor/toast';
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { App } from '@capacitor/app';

export const useCameraPermissions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionDeniedCount, setPermissionDeniedCount] = useState(0);

  useEffect(() => {
    // فحص الأذونات عند تحميل المكون
    const checkPermissions = async () => {
      try {
        setIsLoading(true);
        
        // أولاً: تجربة ملحق MLKitBarcodeScanner
        if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log("فحص إذن MLKitBarcodeScanner");
          const { camera } = await BarcodeScanner.checkPermissions();
          const isGranted = camera === 'granted';
          console.log("نتيجة فحص MLKitBarcodeScanner:", isGranted);
          setHasPermission(isGranted);
          return;
        } 
        
        // ثانياً: تجربة ملحق Camera
        if (window.Capacitor?.isPluginAvailable('Camera')) {
          console.log("فحص إذن Camera");
          const { camera } = await Camera.checkPermissions();
          const isGranted = camera === 'granted';
          console.log("نتيجة فحص Camera:", isGranted);
          setHasPermission(isGranted);
          return;
        } 
        
        // في حالة التطوير على الويب، نفترض وجود الإذن مؤقتًا
        console.log("تشغيل في بيئة الويب، جاري طلب إذن الكاميرا من المتصفح");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          console.log("تم منح إذن كاميرا المتصفح");
          setHasPermission(true);
        } catch (error) {
          console.log("تم رفض إذن كاميرا المتصفح أو غير متاح:", error);
          setHasPermission(false);
        }
      } catch (error) {
        console.error("خطأ في فحص الأذونات:", error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPermissions();
  }, []);

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

  const requestCameraPermission = async () => {
    try {
      setIsLoading(true);
      console.log("طلب إذن الكاميرا، المحاولة رقم:", permissionDeniedCount + 1);
      
      // تسجيل عدد المحاولات
      const attemptCount = permissionDeniedCount + 1;
      
      // إذا تجاوزنا 3 محاولات، نحاول فتح الإعدادات مباشرة
      if (attemptCount > 3) {
        console.log("تجاوز عدد المحاولات، فتح الإعدادات مباشرة");
        await Toast.show({
          text: 'حاولت عدة مرات، يبدو أنك بحاجة لتمكين الإذن يدوياً من إعدادات جهازك',
          duration: 'short'
        });
        
        const opened = await openAppSettings();
        return opened;
      }
      
      // استراتيجية متعددة للمحاولة
      let granted = false;
      
      // المحاولة الأولى: استخدام MLKitBarcodeScanner
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log("استخدام MLKitBarcodeScanner لطلب الإذن");
        
        // عرض رسالة توضيحية
        await Toast.show({
          text: 'التطبيق يحتاج لإذن الكاميرا لمسح الباركود فقط',
          duration: 'short'
        });
        
        // طلب الإذن
        const result = await BarcodeScanner.requestPermissions();
        granted = result.camera === 'granted';
        console.log("نتيجة طلب إذن MLKitBarcodeScanner:", granted);
        
        if (granted) {
          setHasPermission(true);
          setPermissionDeniedCount(0); // إعادة تعيين عداد المحاولات
          return true;
        }
      }
      
      // المحاولة الثانية: استخدام ملحق الكاميرا
      if (!granted && window.Capacitor?.isPluginAvailable('Camera')) {
        console.log("استخدام Camera لطلب الإذن");
        
        // عرض رسالة توضيحية
        await Toast.show({
          text: 'يرجى السماح باستخدام الكاميرا لمسح الباركود',
          duration: 'short'
        });
        
        // طلب الإذن
        const result = await Camera.requestPermissions({
          permissions: ['camera']
        });
        granted = result.camera === 'granted';
        console.log("نتيجة طلب إذن Camera:", granted);
        
        if (granted) {
          setHasPermission(true);
          setPermissionDeniedCount(0); // إعادة تعيين عداد المحاولات
          return true;
        }
      }
      
      // المحاولة الثالثة: في حالة التطوير على الويب
      if (!granted) {
        console.log("محاولة طلب إذن الكاميرا من المتصفح");
        
        // محاولة الاستعلام عن توفر الكاميرا في المتصفح
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // تم منح الإذن، إغلاق التدفق فورًا
            stream.getTracks().forEach(track => track.stop());
            console.log("تم منح إذن كاميرا المتصفح");
            setHasPermission(true);
            setPermissionDeniedCount(0); // إعادة تعيين عداد المحاولات
            return true;
          } catch (error) {
            console.error("تم رفض إذن كاميرا المتصفح:", error);
          }
        }
      }
      
      // زيادة عداد المحاولات الفاشلة
      setPermissionDeniedCount(prev => prev + 1);
      setHasPermission(false);
      
      // إذا وصلنا إلى هنا، فإن الإذن تم رفضه
      console.log("تم رفض إذن الكاميرا في جميع المحاولات");
      
      // عرض رسالة توضيحية للمستخدم
      await Toast.show({
        text: 'لم يتم منح إذن الكاميرا. يرجى تمكينه من إعدادات جهازك للمتابعة.',
        duration: 'long'
      });
      
      // بعد محاولتين، نوجه المستخدم لإعدادات التطبيق
      if (attemptCount >= 2) {
        console.log("محاولة فتح الإعدادات بعد رفض متكرر");
        setTimeout(() => openAppSettings(), 1500);
      }
      
      return false;
    } catch (error) {
      console.error("خطأ في طلب الإذن:", error);
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    hasPermission,
    requestPermission: requestCameraPermission,
    openAppSettings
  };
};
