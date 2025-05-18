
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { App } from '@capacitor/app';

/**
 * التحقق من وجود إذن الكاميرا
 */
export const checkCameraPermission = async (): Promise<boolean> => {
  try {
    console.log('التحقق من إذن الكاميرا...');
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('واجهة برمجة الكاميرا غير مدعومة في هذا المتصفح');
      return false;
    }
    
    // محاولة الوصول إلى معلومات الجهاز أولاً بدون تنشيط الكاميرا
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideoCameras = devices.some(device => device.kind === 'videoinput');
    
    if (!hasVideoCameras) {
      console.warn('لم يتم العثور على كاميرات في هذا الجهاز');
      return false;
    }
    
    // البحث عن إذن الكاميرا المحدد
    // نلاحظ أن هذه الطريقة قد لا تكون دقيقة 100% في جميع المتصفحات
    const cameraPermissionName = 'camera';
    const permissions = await navigator.permissions.query({ name: cameraPermissionName as PermissionName });
    
    if (permissions.state === 'granted') {
      console.log('تم منح إذن الكاميرا بالفعل');
      return true;
    }
    
    if (permissions.state === 'denied') {
      console.warn('تم رفض إذن الكاميرا مسبقاً');
      return false;
    }
    
    // إذا كانت الحالة prompt، نحاول فتح الكاميرا فعلياً للتحقق
    console.log('جاري اختبار الوصول للكاميرا...');
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } 
    });
    
    console.log('تم منح إذن الكاميرا بنجاح');
    
    // إيقاف الكاميرا فوراً بعد التحقق
    stream.getTracks().forEach(track => {
      track.stop();
    });
    
    return true;
  } catch (error) {
    console.error('خطأ في التحقق من إذن الكاميرا:', error);
    return false;
  }
};

/**
 * طلب إذن الكاميرا
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    console.log('طلب إذن الكاميرا...');
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('واجهة برمجة الكاميرا غير مدعومة في هذا المتصفح');
      await Toast.show({ text: 'هذا الجهاز لا يدعم الكاميرا', duration: 'long' });
      return false;
    }
    
    // عرض رسالة للمستخدم
    await Toast.show({ text: 'جاري طلب إذن الكاميرا...', duration: 'short' });
    
    // طلب إذن للكاميرا الخلفية
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      console.log('تم منح إذن الكاميرا بنجاح');
      
      // إيقاف المسارات بعد نجاح الطلب
      stream.getTracks().forEach(track => {
        track.stop();
      });
      
      await Toast.show({ text: 'تم منح إذن الكاميرا بنجاح', duration: 'short' });
      return true;
      
    } catch (error) {
      console.error('تم رفض إذن الكاميرا أو حدث خطأ:', error);
      
      // محاولة تمييز أنواع الخطأ المختلفة
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      let userMessage = 'تعذر الوصول إلى الكاميرا';
      
      if (errorMessage.includes('Permission denied') || errorMessage.includes('Permission dismissed')) {
        userMessage = 'تم رفض إذن الكاميرا. يرجى تمكينه في إعدادات الجهاز';
      } else if (errorMessage.includes('device not found') || errorMessage.includes('Requested device not found')) {
        userMessage = 'تعذر العثور على كاميرا في هذا الجهاز';
      } else if (errorMessage.includes('in use') || errorMessage.includes('is already in use')) {
        userMessage = 'الكاميرا قيد الاستخدام من قبل تطبيق آخر';
      }
      
      await Toast.show({ text: userMessage, duration: 'long' });
      return false;
    }
    
  } catch (error) {
    console.error('خطأ في طلب إذن الكاميرا:', error);
    return false;
  }
};

/**
 * اختبار الكاميرا بشكل مباشر وإرجاع نتيجة الاختبار
 */
export const testCameraDirectly = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('اختبار الكاميرا مباشرة...');
    
    // التحقق من دعم الكاميرا
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { 
        success: false, 
        message: 'واجهة برمجة الكاميرا غير مدعومة في هذا المتصفح' 
      };
    }
    
    // طباعة معلومات الجهاز والمتصفح للتشخيص
    console.log('User Agent:', navigator.userAgent);
    console.log('Platform:', navigator.platform);
    console.log('WebView?', navigator.userAgent.includes('wv'));
    
    // تعداد أجهزة الوسائط المتاحة
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoCameras = devices.filter(device => device.kind === 'videoinput');
    console.log(`عدد الكاميرات المتاحة: ${videoCameras.length}`);
    
    if (videoCameras.length === 0) {
      return { 
        success: false, 
        message: 'لم يتم العثور على كاميرات في هذا الجهاز' 
      };
    }
    
    // طباعة معلومات الكاميرات المتاحة للتشخيص
    videoCameras.forEach((camera, index) => {
      console.log(`الكاميرا ${index + 1}: ${camera.label || '[بدون تسمية]'}`);
    });
    
    // محاولة تشغيل الكاميرا
    const constraints = { 
      video: { 
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } 
    };
    
    console.log('استدعاء getUserMedia مع المحددات:', JSON.stringify(constraints));
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const tracks = stream.getVideoTracks();
    
    if (tracks.length === 0) {
      return { 
        success: false, 
        message: 'تم الوصول للجهاز لكن لا توجد مسارات فيديو' 
      };
    }
    
    console.log('تفاصيل الكاميرا النشطة:');
    const activeTrack = tracks[0];
    console.log(`- الاسم: ${activeTrack.label}`);
    console.log(`- التمكين: ${activeTrack.enabled}`);
    console.log(`- حالة التشغيل: ${activeTrack.readyState}`);
    
    // اختبار ناجح، إيقاف المسارات
    setTimeout(() => {
      tracks.forEach(track => track.stop());
      console.log('تم إيقاف مسارات الفيديو');
    }, 500);
    
    return { 
      success: true, 
      message: `تم التحقق من الكاميرا بنجاح: ${activeTrack.label}` 
    };
  } catch (error) {
    console.error('خطأ في اختبار الكاميرا:', error);
    const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
    
    // تخصيص رسالة الخطأ بناءً على نوع المشكلة
    if (errorMessage.includes('Permission denied') || errorMessage.includes('Permission dismissed')) {
      return { 
        success: false, 
        message: 'تم رفض إذن الكاميرا. يرجى تمكينه في إعدادات الجهاز' 
      };
    } else if (errorMessage.includes('device not found') || errorMessage.includes('Requested device not found')) {
      return { 
        success: false, 
        message: 'تعذر العثور على كاميرا في هذا الجهاز' 
      };
    } else if (errorMessage.includes('in use') || errorMessage.includes('is already in use')) {
      return { 
        success: false, 
        message: 'الكاميرا قيد الاستخدام من قبل تطبيق آخر. يرجى إغلاق التطبيقات الأخرى التي تستخدم الكاميرا' 
      };
    }
    
    return { 
      success: false, 
      message: `فشل اختبار الكاميرا: ${errorMessage}` 
    };
  }
};

/**
 * فتح إعدادات التطبيق
 */
export const openAppSettings = async (): Promise<boolean> => {
  try {
    console.log('محاولة فتح إعدادات التطبيق...');

    // التحقق مما إذا كنا في تطبيق Capacitor أصلي
    if (Capacitor.isNativePlatform()) {
      // محاولة استخدام واجهة برمجة التطبيق لفتح الإعدادات
      if (Capacitor.isPluginAvailable('App')) {
        console.log('استخدام App API لفتح الإعدادات...');
        
        // نحاول فتح إعدادات محددة لأندرويد
        if (Capacitor.getPlatform() === 'android') {
          try {
            // فتح إعدادات التطبيق مباشرة في أندرويد
            // نستخدم أنواعًا خاصة لتمرير القيم المطلوبة
            const appInfo = await App.getInfo();
            console.log('معلومات التطبيق:', appInfo);
            
            // استخدام URL أكثر دقة للوصول لإعدادات التطبيق
            const specificUrl = `package:${appInfo.id || 'app.lovable.b3b6b969583d416c9d8b788fa375abca'}`;
            console.log('محاولة فتح:', specificUrl);
            
            try {
              // محاولة فتح الإعدادات عبر نظام أندرويد
              await App.openUrl({
                url: `app-settings:${specificUrl}`
              });
              return true;
            } catch (e) {
              console.error('خطأ في فتح URL محدد:', e);
              
              // محاولة بديلة لأندرويد
              try {
                await App.openUrl({ url: 'app-settings:' });
                return true;
              } catch (innerError) {
                console.error('فشل أيضًا في محاولة فتح إعدادات التطبيق العامة:', innerError);
              }
            }
          } catch (e) {
            console.error('خطأ في الحصول على معلومات التطبيق:', e);
          }
        } else if (Capacitor.getPlatform() === 'ios') {
          // على نظام iOS، نحاول فتح إعدادات التطبيق
          try {
            await App.openUrl({ url: 'app-settings:' });
            return true;
          } catch (e) {
            console.error('خطأ في فتح إعدادات التطبيق على iOS:', e);
          }
        }
      }
    }
    
    // إذا وصلنا إلى هنا، نخبر المستخدم بفتح الإعدادات يدوياً
    const platform = Capacitor.getPlatform();
    const message = platform === 'android' 
      ? 'يرجى فتح إعدادات > التطبيقات > مخزن الطعام > الأذونات لتمكين الكاميرا'
      : 'يرجى فتح إعدادات > الخصوصية > الكاميرا لتمكين الإذن لتطبيقنا';
    
    console.log('عرض تعليمات الإعدادات اليدوية:', message);
    await Toast.show({ text: message, duration: 'long' });
    
    return false;
  } catch (error) {
    console.error('خطأ في فتح إعدادات التطبيق:', error);
    return false;
  }
};
