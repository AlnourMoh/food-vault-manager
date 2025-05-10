
/**
 * خدمة إدارة أذونات الماسح الضوئي
 */
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { App } from '@capacitor/app';
import { Camera } from '@capacitor/camera';

export class ScannerPermissionService {
  private permissionAttempts = 0;
  
  /**
   * فحص وجود إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: فحص إذن الكاميرا');
      
      // تسجيل معلومات عن بيئة التشغيل للمساعدة في تشخيص المشاكل
      console.log('ScannerPermissionService: المنصة:', Capacitor.getPlatform());
      console.log('ScannerPermissionService: بيئة نظام أصلي؟', Capacitor.isNativePlatform());
      
      // في بيئة التطبيق الأصلي
      if (Capacitor.isNativePlatform()) {
        // تحقق من وجود ملحقات الكاميرا
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('ScannerPermissionService: استخدام MLKitBarcodeScanner لفحص الإذن');
          try {
            const status = await BarcodeScanner.checkPermissions();
            const isGranted = status.camera === 'granted';
            console.log('ScannerPermissionService: نتيجة فحص MLKitBarcodeScanner:', isGranted);
            return isGranted;
          } catch (error) {
            console.error('ScannerPermissionService: خطأ في التحقق من إذن MLKitBarcodeScanner:', error);
            // استمرار للطريقة التالية
          }
        }
        
        if (Capacitor.isPluginAvailable('Camera')) {
          console.log('ScannerPermissionService: استخدام Camera لفحص الإذن');
          try {
            const status = await Camera.checkPermissions();
            const isGranted = status.camera === 'granted';
            console.log('ScannerPermissionService: نتيجة فحص Camera:', isGranted);
            return isGranted;
          } catch (error) {
            console.error('ScannerPermissionService: خطأ في التحقق من إذن Camera:', error);
            // استمرار للطريقة التالية إذا فشلت هذه
          }
        }
      }
      
      // في بيئة الويب، نحاول الوصول للكاميرا مباشرة
      if (!Capacitor.isNativePlatform()) {
        console.log('ScannerPermissionService: في بيئة الويب، نحاول التحقق من إذن الكاميرا مباشرة');
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log('ScannerPermissionService: واجهة mediaDevices غير متوفرة في هذا المتصفح');
            return false;
          }
            
          // محاولة الوصول للكاميرا مع خيارات أكثر تحديدًا
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
          
          // إذا نجحت المحاولة، نتوقف مباشرة عن استخدام الكاميرا
          if (stream && stream.getTracks) {
            stream.getTracks().forEach(track => {
              console.log('ScannerPermissionService: إيقاف مسار الكاميرا:', track.kind);
              track.stop();
            });
          }
          
          console.log('ScannerPermissionService: تم منح إذن الكاميرا في المتصفح');
          return true;
        } catch (error) {
          console.error('ScannerPermissionService: خطأ في التحقق من إذن الكاميرا في المتصفح:', error);
          return false;
        }
      }
      
      // إذا وصلنا إلى هنا، فهذا يعني أننا لم نتمكن من التحقق من الإذن
      console.warn('ScannerPermissionService: لا توجد طريقة للتحقق من الإذن');
      return false;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في فحص الإذن:', error);
      
      await Toast.show({
        text: 'حدث خطأ أثناء التحقق من أذونات الكاميرا',
        duration: 'short'
      });
      
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: طلب إذن الكاميرا');
      this.permissionAttempts++;
      
      // عرض رسالة للمستخدم
      await Toast.show({
        text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
        duration: 'short'
      });
      
      // في بيئة الويب، نحاول الوصول للكاميرا مباشرة
      if (!Capacitor.isNativePlatform()) {
        console.log('ScannerPermissionService: في بيئة الويب، نحاول طلب إذن الكاميرا مباشرة');
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log('ScannerPermissionService: واجهة mediaDevices غير متوفرة في هذا المتصفح');
            return false;
          }
            
          // محاولة الوصول للكاميرا مع خيارات أكثر تحديدًا للويب
          const constraints = {
            audio: false,
            video: { 
              facingMode: { ideal: 'environment' },
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 }
            } 
          };
          
          console.log('ScannerPermissionService: طلب الكاميرا بالمواصفات:', JSON.stringify(constraints));
          
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          
          // إذا نجحت المحاولة، نحتفظ بالتدفق مؤقتًا للتأكد من أن الكاميرا تعمل
          if (stream && stream.getTracks) {
            // تحقق من حالة المسارات
            const videoTracks = stream.getVideoTracks();
            if (videoTracks.length > 0) {
              console.log('ScannerPermissionService: الكاميرا المستخدمة:', videoTracks[0].label);
              console.log('ScannerPermissionService: المسارات النشطة:', videoTracks.length);
              
              // انتظر قليلاً للتأكد من فتح الكاميرا قبل إغلاقها
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // ثم أوقف المسارات
              videoTracks.forEach(track => {
                console.log('ScannerPermissionService: إيقاف مسار الكاميرا:', track.kind);
                track.stop();
              });
            }
          }
          
          console.log('ScannerPermissionService: تم منح إذن الكاميرا في المتصفح');
          
          // تأكيد نجاح العملية للمستخدم
          await Toast.show({
            text: 'تم منح إذن الكاميرا بنجاح',
            duration: 'short'
          });
          
          return true;
        } catch (error) {
          console.error('ScannerPermissionService: خطأ في طلب إذن الكاميرا في المتصفح:', error);
          await Toast.show({
            text: 'تم رفض إذن الكاميرا في المتصفح. يرجى تفعيله من إعدادات المتصفح',
            duration: 'long'
          });
          
          // محاولة فتح إعدادات المتصفح إذا أمكن
          if (error instanceof DOMException && error.name === 'NotAllowedError') {
            alert('لاستخدام الماسح الضوئي، يجب السماح بالوصول إلى الكاميرا.\nيرجى النقر على أيقونة القفل في شريط العنوان وتمكين الكاميرا.');
          }
          
          return false;
        }
      }
      
      // طلب الإذن في البيئة الأصلية (تطبيق جوال)
      console.log('ScannerPermissionService: طلب إذن الكاميرا في بيئة التطبيق الأصلي');
      
      // استخدام MLKit إذا كان متاحًا
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('ScannerPermissionService: استخدام MLKitBarcodeScanner لطلب الإذن');
        try {
          const result = await BarcodeScanner.requestPermissions();
          const granted = result.camera === 'granted';
          console.log('ScannerPermissionService: نتيجة طلب إذن MLKit:', granted);
          
          if (granted) {
            return true;
          }
          
          // إذا تم الرفض وتجاوزنا عدد المحاولات، افتح الإعدادات
          if (this.permissionAttempts > 1) {
            console.log('ScannerPermissionService: فتح الإعدادات بعد رفض متكرر');
            await this.openAppSettings();
          }
          return false;
        } catch (error) {
          console.error('ScannerPermissionService: خطأ في طلب إذن MLKit:', error);
          // نستمر للخيار التالي
        }
      }
      
      // استخدام Camera إذا كان متاحًا
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('ScannerPermissionService: استخدام Camera لطلب الإذن');
        try {
          const result = await Camera.requestPermissions({ permissions: ['camera'] });
          const granted = result.camera === 'granted';
          console.log('ScannerPermissionService: نتيجة طلب إذن Camera:', granted);
          
          if (granted) {
            return true;
          }
          
          // إذا تم الرفض وتجاوزنا عدد المحاولات، افتح الإعدادات
          if (this.permissionAttempts > 1) {
            console.log('ScannerPermissionService: فتح الإعدادات بعد رفض متكرر');
            await this.openAppSettings();
          }
          return false;
        } catch (error) {
          console.error('ScannerPermissionService: خطأ في طلب إذن Camera:', error);
        }
      }

      return false;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في طلب الإذن:', error);
      
      await Toast.show({
        text: 'حدث خطأ أثناء طلب إذن الكاميرا',
        duration: 'short'
      });
      
      return false;
    }
  }
  
  /**
   * فتح إعدادات التطبيق لتمكين الإذن
   */
  public async openAppSettings(): Promise<boolean> {
    console.log('ScannerPermissionService: فتح إعدادات التطبيق');
    
    // عرض رسالة توضيحية للمستخدم
    await Toast.show({
      text: 'سيتم توجيهك إلى إعدادات التطبيق لتمكين إذن الكاميرا',
      duration: 'short'
    });
    
    try {
      // التحقق من المنصة
      const platform = Capacitor.getPlatform();
      
      // استخدام باركود سكانر لفتح الإعدادات إذا كان متاحًا
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('ScannerPermissionService: استخدام MLKitBarcodeScanner.openSettings()');
        try {
          await BarcodeScanner.openSettings();
          return true;
        } catch (error) {
          console.error('ScannerPermissionService: خطأ في فتح إعدادات MLKit:', error);
          // نستمر للخيار التالي
        }
      }
      
      // عرض إرشادات للمستخدم حسب المنصة
      if (platform === 'ios') {
        await Toast.show({
          text: 'يرجى فتح إعدادات جهازك > الخصوصية > الكاميرا، وتمكين إذن الكاميرا للتطبيق',
          duration: 'long'
        });
        
        // محاولة فتح إعدادات التطبيق على iOS
        try {
          await App.openUrl('app-settings:');
          return true;
        } catch (e) {
          console.error('فشل في فتح إعدادات التطبيق على iOS:', e);
        }
      } else if (platform === 'android') {
        await Toast.show({
          text: 'يرجى فتح إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات > الكاميرا',
          duration: 'long'
        });
        
        // محاولة فتح إعدادات التطبيق على Android
        try {
          await App.openUrl('package:' + (await App.getInfo()).id);
          return true;
        } catch (e) {
          console.error('فشل في فتح إعدادات التطبيق على Android:', e);
        }
      } else {
        await Toast.show({
          text: 'يرجى تمكين إذن الكاميرا من إعدادات جهازك',
          duration: 'long'
        });
      }
      
      return true;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في فتح الإعدادات:', error);
      
      await Toast.show({
        text: 'حدث خطأ أثناء محاولة فتح إعدادات التطبيق',
        duration: 'short'
      });
      
      return false;
    }
  }
  
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    try {
      // في بيئة التطبيق الأصلي
      if (Capacitor.isNativePlatform()) {
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          try {
            const result = await BarcodeScanner.isSupported();
            return result.supported;
          } catch (error) {
            console.error('ScannerPermissionService: خطأ في التحقق من الدعم على MLKit:', error);
            // نستمر للخيار التالي
          }
        }
      }
      
      // في بيئة الويب، نتحقق من دعم getUserMedia
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        // تحقق إضافي من وجود كاميرا
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasCamera = devices.some(device => device.kind === 'videoinput');
          if (hasCamera) {
            return true;
          } else {
            console.log('ScannerPermissionService: لا توجد كاميرا متاحة في هذا الجهاز');
            return false;
          }
        } catch (error) {
          console.error('ScannerPermissionService: خطأ في التحقق من وجود كاميرا:', error);
          return true; // نفترض وجود كاميرا في حالة الخطأ
        }
      }
      
      console.warn('ScannerPermissionService: الجهاز لا يدعم الماسح الضوئي');
      return false;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في التحقق من دعم الجهاز:', error);
      return false;
    }
  }
}

// إنشاء نسخة مفردة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerPermissionService = new ScannerPermissionService();
