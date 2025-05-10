
/**
 * خدمة إدارة أذونات الماسح الضوئي
 */
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { App } from '@capacitor/app';
import { Camera } from '@capacitor/camera';
import { Browser } from '@capacitor/browser';

export class ScannerPermissionService {
  private static instance: ScannerPermissionService;
  private permissionAttempts = 0;
  
  private constructor() {}
  
  public static getInstance(): ScannerPermissionService {
    if (!ScannerPermissionService.instance) {
      ScannerPermissionService.instance = new ScannerPermissionService();
    }
    return ScannerPermissionService.instance;
  }
  
  /**
   * التحقق من دعم الماسح الضوئي على الجهاز
   */
  public async isSupported(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: التحقق من دعم الماسح الضوئي');
      
      // في حالة التطبيق الأصلي
      if (Capacitor.isNativePlatform()) {
        // التحقق من وجود ملحق MLKitBarcodeScanner
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('ScannerPermissionService: ملحق MLKitBarcodeScanner متاح');
          try {
            const result = await BarcodeScanner.isSupported();
            console.log('ScannerPermissionService: نتيجة التحقق من الدعم:', result.supported);
            return result.supported;
          } catch (error) {
            console.error('ScannerPermissionService: خطأ في التحقق من دعم MLKitBarcodeScanner:', error);
          }
        }
        
        // بديل: التحقق من وجود ملحق الكاميرا
        if (Capacitor.isPluginAvailable('Camera')) {
          console.log('ScannerPermissionService: ملحق Camera متاح، نفترض دعم المسح الضوئي');
          return true;
        }
        
        console.warn('ScannerPermissionService: لم يتم العثور على أي ملحق للكاميرا أو المسح الضوئي');
        return false;
      }
      
      // في بيئة الويب
      console.log('ScannerPermissionService: التحقق من دعم الكاميرا في المتصفح');
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('ScannerPermissionService: واجهة برمجة الكاميرا متاحة في المتصفح');
        return true;
      }
      
      console.log('ScannerPermissionService: واجهة برمجة الكاميرا غير متاحة في المتصفح');
      return false;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في التحقق من دعم الماسح الضوئي:', error);
      return false;
    }
  }
  
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
            // استمرار للطريقة التالية
          }
        }
        
        console.log('ScannerPermissionService: لا توجد طرق مناسبة للتحقق من الإذن في الجهاز');
        return false;
      }
      
      // في بيئة الويب، نحاول استخدام واجهة برمجة الكاميرا
      try {
        console.log('ScannerPermissionService: فحص إذن الكاميرا في المتصفح');
        // التحقق من وجود واجهة برمجة الكاميرا
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.warn('ScannerPermissionService: واجهة getUserMedia غير متاحة في هذا المتصفح');
          return false;
        }
        
        // محاولة الوصول إلى الكاميرا - ملاحظة: سنتجنب الوصول الفعلي هنا لتجنب طلب الإذن
        // نفترض أن الإذن قد يكون متاحًا، وسيتم التحقق عند البدء الفعلي للمسح
        console.log('ScannerPermissionService: نفترض أن إذن الكاميرا متاح في المتصفح، وسيتم التحقق لاحقًا');
        return true;
      } catch (error) {
        console.warn('ScannerPermissionService: خطأ في التحقق من إذن الكاميرا في المتصفح:', error);
        return false;
      }
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في التحقق من إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن استخدام الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: طلب إذن الكاميرا');
      
      // زيادة عدد محاولات طلب الإذن
      this.permissionAttempts++;
      console.log('ScannerPermissionService: المحاولة رقم:', this.permissionAttempts);
      
      // التحقق أولاً إذا كان الإذن موجوداً بالفعل
      const hasPermission = await this.checkPermission();
      if (hasPermission) {
        console.log('ScannerPermissionService: الإذن ممنوح بالفعل، لا حاجة لطلبه');
        // عرض إشعار للتأكيد
        await Toast.show({
          text: 'تم منح إذن الكاميرا بالفعل',
          duration: 'short'
        });
        return true;
      }
      
      // في بيئة التطبيق الأصلي
      if (Capacitor.isNativePlatform()) {
        // محاولة استخدام MLKitBarcodeScanner
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('ScannerPermissionService: استخدام MLKitBarcodeScanner لطلب الإذن');
          
          try {
            // عرض رسالة توضيحية
            await Toast.show({
              text: 'التطبيق يحتاج لإذن الكاميرا لمسح الباركود',
              duration: 'short'
            });
            
            // طلب الإذن بشكل مباشر - يجب طلب الإذن قبل استخدام الماسح
            console.log('ScannerPermissionService: طلب الإذن مباشرة من MLKitBarcodeScanner');
            await BarcodeScanner.requestPermissions();
            
            // التحقق من نتيجة طلب الإذن
            const status = await BarcodeScanner.checkPermissions();
            const granted = status.camera === 'granted';
            console.log('ScannerPermissionService: تم التحقق من نتيجة طلب الإذن من MLKitBarcodeScanner:', granted);
            
            if (granted) {
              this.permissionAttempts = 0; // إعادة تعيين عداد المحاولات
              await Toast.show({
                text: 'تم منح إذن الكاميرا بنجاح',
                duration: 'short'
              });
              return true;
            }
          } catch (error) {
            console.error('ScannerPermissionService: خطأ في طلب إذن MLKitBarcodeScanner:', error);
            // استمرار للطريقة التالية
          }
        }
        
        // محاولة استخدام Camera
        if (Capacitor.isPluginAvailable('Camera')) {
          console.log('ScannerPermissionService: استخدام Camera لطلب الإذن');
          
          try {
            // عرض رسالة توضيحية
            await Toast.show({
              text: 'يرجى السماح باستخدام الكاميرا لمسح الباركود',
              duration: 'short'
            });
            
            // طلب الإذن
            const result = await Camera.requestPermissions({
              permissions: ['camera']
            });
            const granted = result.camera === 'granted';
            console.log('ScannerPermissionService: نتيجة طلب إذن Camera:', granted);
            
            if (granted) {
              this.permissionAttempts = 0; // إعادة تعيين عداد المحاولات
              await Toast.show({
                text: 'تم منح إذن الكاميرا بنجاح',
                duration: 'short'
              });
              return true;
            }
          } catch (error) {
            console.error('ScannerPermissionService: خطأ في طلب إذن Camera:', error);
            // استمرار للطريقة التالية
          }
        }
        
        // إذا وصلنا إلى هنا في بيئة التطبيق الأصلي، فهذا يعني أن الإذن تم رفضه
        console.log('ScannerPermissionService: تم رفض إذن الكاميرا في بيئة التطبيق الأصلي');
        
        // إذا تجاوزنا عدد معين من المحاولات، نحاول فتح الإعدادات
        if (this.permissionAttempts >= 2) {
          console.log('ScannerPermissionService: تجاوزنا عدد المحاولات، محاولة فتح الإعدادات');
          
          // عرض رسالة توضيحية
          await Toast.show({
            text: 'يبدو أنك رفضت إذن الكاميرا. سنحاول فتح إعدادات التطبيق لتمكينه يدوياً.',
            duration: 'long'
          });
          
          // محاولة فتح الإعدادات
          await this.openAppSettings();
        } else {
          // عرض رسالة توضيحية
          await Toast.show({
            text: 'تم رفض إذن الكاميرا. الرجاء المحاولة مرة أخرى.',
            duration: 'short'
          });
        }
        
        return false;
      }
      
      // في بيئة الويب، نحاول استخدام واجهة برمجة الكاميرا
      try {
        console.log('ScannerPermissionService: طلب إذن الكاميرا في المتصفح');
        
        // التحقق من وجود واجهة برمجة الكاميرا
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.warn('ScannerPermissionService: واجهة getUserMedia غير متاحة في هذا المتصفح');
          
          // عرض رسالة للمستخدم
          await Toast.show({
            text: 'متصفحك لا يدعم الوصول إلى الكاميرا.',
            duration: 'long'
          });
          
          return false;
        }
        
        // في بيئة الويب نفترض أن الإذن سيطلب تلقائياً عند بدء الماسح
        console.log('ScannerPermissionService: إذن الكاميرا سيطلب تلقائياً عند بدء المسح في المتصفح');
        return true;
      } catch (error) {
        console.warn('ScannerPermissionService: خطأ في طلب إذن الكاميرا في المتصفح:', error);
        
        // عرض رسالة للمستخدم
        await Toast.show({
          text: 'تم رفض إذن الكاميرا. يرجى تمكينه من إعدادات المتصفح.',
          duration: 'long'
        });
        
        return false;
      }
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * فتح إعدادات التطبيق للسماح للمستخدم بتمكين الأذونات يدوياً
   */
  public async openAppSettings(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: محاولة فتح إعدادات التطبيق');
      
      // تسجيل المنصة الحالية
      const platform = Capacitor.getPlatform();
      console.log('ScannerPermissionService: المنصة الحالية:', platform);
      
      // التحقق من بيئة التشغيل
      if (!Capacitor.isNativePlatform()) {
        console.log('ScannerPermissionService: لسنا في بيئة تطبيق أصلي، لا يمكن فتح الإعدادات');
        return false;
      }
      
      // عرض رسالة توضيحية للمستخدم
      await Toast.show({
        text: 'جاري فتح إعدادات التطبيق لتمكين إذن الكاميرا',
        duration: 'short'
      });
      
      // تحديد طريقة فتح الإعدادات حسب المنصة
      if (platform === 'android') {
        try {
          // على نظام Android، نحاول استخدام BarcodeScanner لفتح الإعدادات
          if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
            console.log('ScannerPermissionService: استخدام MLKitBarcodeScanner لفتح الإعدادات');
            await BarcodeScanner.openSettings();
            return true;
          }
          
          // بديل: استخدام Browser لفتح إعدادات التطبيق مباشرة
          console.log('ScannerPermissionService: استخدام Browser لفتح إعدادات التطبيق');
          const appInfo = await App.getInfo();
          await Browser.open({
            url: 'package:' + appInfo.id
          });
          return true;
        } catch (error) {
          console.error('ScannerPermissionService: خطأ في فتح إعدادات Android:', error);
          
          // عرض رسالة توضيحية
          await Toast.show({
            text: 'فشل فتح الإعدادات. يرجى فتح إعدادات التطبيق يدوياً وتفعيل إذن الكاميرا.',
            duration: 'long'
          });
          
          return false;
        }
      } 
      // على نظام iOS
      else if (platform === 'ios') {
        try {
          // على iOS، نحاول استخدام BarcodeScanner لفتح الإعدادات
          if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
            console.log('ScannerPermissionService: استخدام MLKitBarcodeScanner لفتح إعدادات iOS');
            await BarcodeScanner.openSettings();
            return true;
          }
          
          // بديل: فتح تطبيق الإعدادات مباشرة (قد لا يعمل في جميع إصدارات iOS)
          console.log('ScannerPermissionService: فتح تطبيق الإعدادات مباشرة في iOS');
          await App.exitApp(); // على iOS، هذا سيطلب من المستخدم الخروج والذهاب إلى الإعدادات
          
          // عرض رسالة توضيحية
          await Toast.show({
            text: 'يرجى فتح الإعدادات > الخصوصية > الكاميرا، ثم تفعيل الإذن للتطبيق',
            duration: 'long'
          });
          
          return true;
        } catch (error) {
          console.error('ScannerPermissionService: خطأ في فتح إعدادات iOS:', error);
          
          // عرض رسالة توضيحية
          await Toast.show({
            text: 'يرجى فتح الإعدادات > الخصوصية > الكاميرا، ثم تفعيل الإذن للتطبيق',
            duration: 'long'
          });
          
          return false;
        }
      }
      
      console.warn('ScannerPermissionService: منصة غير معروفة:', platform);
      return false;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في فتح إعدادات التطبيق:', error);
      return false;
    }
  }
}

// تصدير نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerPermissionService = ScannerPermissionService.getInstance();
