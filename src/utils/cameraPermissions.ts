
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';

/**
 * التحقق من إذن الكاميرا
 */
export async function checkCameraPermission(): Promise<boolean> {
  try {
    // تسجيل التشخيص
    console.log('checkCameraPermission: التحقق من إذن الكاميرا على المنصة:', Capacitor.getPlatform());
    console.log('checkCameraPermission: هل هذا تطبيق أصلي؟', Capacitor.isNativePlatform());
    console.log('checkCameraPermission: ملحق Barcode متاح؟', Capacitor.isPluginAvailable('MLKitBarcodeScanner'));
    console.log('checkCameraPermission: ملحق Camera متاح؟', Capacitor.isPluginAvailable('Camera'));
    
    // التحقق من بيئة التشغيل
    if (Capacitor.isNativePlatform()) {
      // التحقق من وجود ملحقات الكاميرا
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const status = await BarcodeScanner.checkPermissions();
        console.log('checkCameraPermission: نتيجة فحص MLKit:', status);
        return status.camera === 'granted';
      }
      
      if (Capacitor.isPluginAvailable('Camera')) {
        const status = await Camera.checkPermissions();
        console.log('checkCameraPermission: نتيجة فحص Camera:', status);
        return status.camera === 'granted';
      }
    }
    
    // في بيئة الويب، نحاول الوصول للكاميرا
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      try {
        console.log('checkCameraPermission: محاولة تفعيل كاميرا المتصفح');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment'  // استخدام الكاميرا الخلفية إن أمكن
          } 
        });
        
        // إيقاف المسار فوراً بعد التحقق من الإذن
        stream.getTracks().forEach(track => {
          console.log('checkCameraPermission: إيقاف مسار الكاميرا بعد الفحص:', track.kind);
          track.stop();
        });
        
        console.log('checkCameraPermission: تم منح إذن كاميرا المتصفح');
        return true;
      } catch (error) {
        console.error('checkCameraPermission: تم رفض إذن كاميرا المتصفح:', error);
        return false;
      }
    }
    
    // في بيئة المحاكاة، نفترض أن الإذن موجود لتسهيل الاختبار
    if (!Capacitor.isNativePlatform()) {
      console.log('checkCameraPermission: في وضع المحاكاة، نفترض أن الإذن موجود');
      return true;
    }
    
    console.warn('checkCameraPermission: لا توجد طريقة للتحقق من إذن الكاميرا');
    return false;
  } catch (error) {
    console.error('خطأ في التحقق من إذن الكاميرا:', error);
    return false;
  }
}

/**
 * طلب إذن الكاميرا
 */
export async function requestCameraPermission(): Promise<boolean> {
  try {
    // التحقق أولاً مما إذا كان الإذن ممنوحًا بالفعل
    const alreadyGranted = await checkCameraPermission();
    if (alreadyGranted) {
      console.log('requestCameraPermission: الإذن ممنوح بالفعل');
      return true;
    }
    
    console.log('requestCameraPermission: طلب إذن الكاميرا على المنصة:', Capacitor.getPlatform());
    
    // التحقق من بيئة التشغيل
    if (Capacitor.isNativePlatform()) {
      // التحقق من وجود ملحقات الكاميرا
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('requestCameraPermission: استخدام MLKitBarcodeScanner لطلب الإذن');
        
        // عرض رسالة توضيحية للمستخدم
        await Toast.show({
          text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
          duration: 'short'
        });
        
        const result = await BarcodeScanner.requestPermissions();
        console.log('requestCameraPermission: نتيجة طلب أذونات MLKit:', result);
        return result.camera === 'granted';
      }
      
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('requestCameraPermission: استخدام Camera لطلب الإذن');
        
        // عرض رسالة توضيحية للمستخدم
        await Toast.show({
          text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
          duration: 'short'
        });
        
        const result = await Camera.requestPermissions({ permissions: ['camera'] });
        console.log('requestCameraPermission: نتيجة طلب أذونات الكاميرا:', result);
        return result.camera === 'granted';
      }
    }
    
    // في بيئة الويب، نحاول الوصول للكاميرا
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      try {
        console.log('requestCameraPermission: طلب إذن كاميرا المتصفح');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment'  // استخدام الكاميرا الخلفية إن أمكن
          } 
        });
        
        // إيقاف المسار فوراً بعد التحقق من الإذن
        stream.getTracks().forEach(track => track.stop());
        console.log('requestCameraPermission: تم منح إذن كاميرا المتصفح');
        return true;
      } catch (error) {
        console.error('requestCameraPermission: تم رفض إذن كاميرا المتصفح:', error);
        return false;
      }
    }
    
    // في بيئة المحاكاة، نفترض أن الإذن يمكن منحه
    if (!Capacitor.isNativePlatform()) {
      console.log('requestCameraPermission: في وضع المحاكاة، نفترض أن الإذن يمكن منحه');
      return true;
    }
    
    console.warn('requestCameraPermission: لا توجد طريقة لطلب إذن الكاميرا');
    return false;
  } catch (error) {
    console.error('خطأ في طلب إذن الكاميرا:', error);
    return false;
  }
}

/**
 * فتح إعدادات الجهاز
 */
export async function openAppSettings(): Promise<boolean> {
  try {
    if (!Capacitor.isNativePlatform()) {
      console.log('openAppSettings: لسنا في وضع الأصلي، لا يمكن فتح الإعدادات');
      return false;
    }
    
    // عرض رسالة توضيحية للمستخدم
    await Toast.show({
      text: 'سيتم توجيهك إلى إعدادات التطبيق لتمكين إذن الكاميرا',
      duration: 'short'
    });
    
    // محاولة فتح الإعدادات باستخدام ملحق MLKit إذا كان متاحًا
    if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
      console.log('openAppSettings: استخدام MLKitBarcodeScanner لفتح الإعدادات');
      await BarcodeScanner.openSettings();
      return true;
    }
    
    // إذا لم تكن الطريقة أعلاه متاحة، نعرض رسالة إرشادية
    const platform = Capacitor.getPlatform();
    if (platform === 'ios') {
      await Toast.show({
        text: 'يرجى فتح إعدادات جهازك > الخصوصية > الكاميرا، وتمكين إذن الكاميرا للتطبيق',
        duration: 'long'
      });
    } else if (platform === 'android') {
      await Toast.show({
        text: 'يرجى فتح إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات، وتمكين إذن الكاميرا',
        duration: 'long'
      });
    }
    
    return false;
  } catch (error) {
    console.error('خطأ في فتح إعدادات التطبيق:', error);
    return false;
  }
}
