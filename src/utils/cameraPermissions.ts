
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
        try {
          const status = await BarcodeScanner.checkPermissions();
          console.log('checkCameraPermission: نتيجة فحص MLKit:', status);
          return status.camera === 'granted';
        } catch (error) {
          console.error('خطأ في فحص أذونات MLKit:', error);
          // نحاول طريقة أخرى
        }
      }
      
      if (Capacitor.isPluginAvailable('Camera')) {
        try {
          const status = await Camera.checkPermissions();
          console.log('checkCameraPermission: نتيجة فحص Camera:', status);
          return status.camera === 'granted';
        } catch (error) {
          console.error('خطأ في فحص أذونات Camera:', error);
          // نحاول طريقة أخرى
        }
      }
      
      console.warn('checkCameraPermission: لا توجد ملحقات متاحة لفحص التصاريح');
    }
    
    // في بيئة الويب، نتحقق من القدرة على الوصول للكاميرا دون طلبها بالفعل
    if ('mediaDevices' in navigator) {
      if ('enumerateDevices' in navigator.mediaDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasCamera = devices.some(device => device.kind === 'videoinput');
          console.log('checkCameraPermission: تم العثور على كاميرات؟', hasCamera);
          
          if (hasCamera) {
            // هذا لا يخبرنا عما إذا كان لدينا إذن فعلي، فقط أنه تم اكتشاف كاميرا
            return true;
          }
          return false;
        } catch (error) {
          console.error('خطأ في تعداد الأجهزة:', error);
        }
      }
    }
    
    // في حالة الفشل، نرجع false
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
      // محاولة استخدام MLKitBarcodeScanner أولاً
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          console.log('requestCameraPermission: استخدام MLKitBarcodeScanner لطلب الإذن');
          
          // عرض رسالة توضيحية للمستخدم
          await Toast.show({
            text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
            duration: 'short'
          }).catch(() => {
            console.log('فشل عرض Toast');
          });
          
          const result = await BarcodeScanner.requestPermissions();
          console.log('requestCameraPermission: نتيجة طلب أذونات MLKit:', result);
          return result.camera === 'granted';
        } catch (error) {
          console.error('خطأ في طلب أذونات MLKit:', error);
          // نحاول طريقة أخرى
        }
      }
      
      // محاولة استخدام ملحق الكاميرا العادي
      if (Capacitor.isPluginAvailable('Camera')) {
        try {
          console.log('requestCameraPermission: استخدام Camera لطلب الإذن');
          
          // عرض رسالة توضيحية للمستخدم
          await Toast.show({
            text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
            duration: 'short'
          }).catch(() => {
            console.log('فشل عرض Toast');
          });
          
          const result = await Camera.requestPermissions({ permissions: ['camera'] });
          console.log('requestCameraPermission: نتيجة طلب أذونات الكاميرا:', result);
          return result.camera === 'granted';
        } catch (error) {
          console.error('خطأ في طلب أذونات الكاميرا:', error);
          // نحاول طريقة أخرى
        }
      }
      
      console.warn('requestCameraPermission: لا توجد ملحقات متاحة لطلب الإذن');
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
    
    // في حالة الفشل في كل المحاولات
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
    // عرض رسالة توضيحية للمستخدم
    await Toast.show({
      text: 'سيتم توجيهك إلى إعدادات التطبيق لتمكين إذن الكاميرا',
      duration: 'long'
    }).catch(() => {
      console.log('فشل عرض Toast');
    });

    if (Capacitor.isNativePlatform()) {
      const platform = Capacitor.getPlatform();
      
      if (platform === 'android') {
        // رسالة مخصصة للأندرويد
        await Toast.show({
          text: 'في إعدادات التطبيق، اختر "الأذونات" ثم "الكاميرا" وقم بتمكينها',
          duration: 'long'
        }).catch(() => {});
      } else if (platform === 'ios') {
        // رسالة مخصصة لأجهزة iOS
        await Toast.show({
          text: 'في إعدادات التطبيق، تأكد من تمكين إذن الكاميرا',
          duration: 'long'
        }).catch(() => {});
      }

      // محاولة فتح الإعدادات باستخدام ملحق MLKit
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          console.log('openAppSettings: استخدام MLKitBarcodeScanner لفتح الإعدادات');
          await BarcodeScanner.openSettings();
          return true;
        } catch (error) {
          console.error('خطأ في فتح الإعدادات باستخدام MLKit:', error);
        }
      }
      
      console.warn('لا يمكن فتح الإعدادات تلقائياً. يرجى فتح إعدادات التطبيق يدوياً');
    }
    
    // في حالة الفشل، عرض رسالة إرشادية
    const platformText = Capacitor.getPlatform() === 'ios' 
      ? 'فتح الإعدادات > الخصوصية > الكاميرا > مخزن الطعام' 
      : 'فتح الإعدادات > التطبيقات > مخزن الطعام > الأذونات > الكاميرا';
    
    await Toast.show({
      text: `يرجى ${platformText} لتمكين إذن الكاميرا`,
      duration: 'long'
    }).catch(() => {});
    
    return false;
  } catch (error) {
    console.error('خطأ في فتح إعدادات التطبيق:', error);
    return false;
  }
}

/**
 * اختبار الكاميرا مباشرة
 */
export async function testCameraDirectly(): Promise<{success: boolean, message: string}> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        success: false,
        message: 'واجهة برمجة الكاميرا غير متاحة في هذا المتصفح/الجهاز'
      };
    }

    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } 
    });
    
    // إيقاف البث حتى لا يستمر
    stream.getTracks().forEach(track => track.stop());
    
    return {
      success: true,
      message: 'تم الوصول للكاميرا بنجاح، تم إيقاف البث'
    };
  } catch (error) {
    return {
      success: false,
      message: `فشل الوصول للكاميرا: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
    };
  }
}
