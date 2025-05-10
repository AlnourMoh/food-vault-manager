
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
        
        // محاولة استخدام Android API مباشرة
        console.log('ScannerPermissionService: استخدام Android API مباشرة غير متاح');
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
        
        // محاولة الوصول إلى الكاميرا
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        console.log('ScannerPermissionService: تم الحصول على بث الكاميرا، اختبار ناجح');
        
        // إغلاق المسار فورًا بعد التحقق لتجنب تعارضات لاحقة
        stream.getTracks().forEach(track => {
          console.log(`ScannerPermissionService: إيقاف مسار ${track.kind} بعد التحقق من الإذن`);
          track.stop();
        });
        
        console.log('ScannerPermissionService: تم منح إذن الكاميرا في المتصفح');
        return true;
      } catch (error) {
        console.warn('ScannerPermissionService: تم رفض إذن الكاميرا في المتصفح:', error);
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
            
            // طلب الإذن
            const result = await BarcodeScanner.requestPermissions();
            const granted = result.camera === 'granted';
            console.log('ScannerPermissionService: نتيجة طلب إذن MLKitBarcodeScanner:', granted);
            
            if (granted) {
              this.permissionAttempts = 0; // إعادة تعيين عداد المحاولات
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
        
        // محاولة الوصول إلى الكاميرا
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            facingMode: 'environment',
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 }
          }
        });
        
        // إغلاق المسار فورًا بعد التحقق
        stream.getTracks().forEach(track => {
          track.stop();
        });
        
        console.log('ScannerPermissionService: تم منح إذن الكاميرا في المتصفح');
        this.permissionAttempts = 0; // إعادة تعيين عداد المحاولات
        return true;
      } catch (error) {
        console.warn('ScannerPermissionService: تم رفض إذن الكاميرا في المتصفح:', error);
        
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
      
      // على نظام Android
      if (platform === 'android') {
        try {
          // الحصول على معلومات التطبيق
          const appInfo = await App.getInfo();
          // استخدام Browser بدلاً من App.openUrl
          await Browser.open({
            url: 'package:' + appInfo.id
          });
          return true;
        } catch (error) {
          console.error('ScannerPermissionService: خطأ في فتح إعدادات Android:', error);
          
          // عرض رسالة توضيحية
          await Toast.show({
            text: 'تعذر فتح إعدادات التطبيق، يرجى فتحها يدوياً',
            duration: 'long'
          });
          
          return false;
        }
      } 
      // على نظام iOS
      else if (platform === 'ios') {
        try {
          // استخدام Browser بدلاً من App.openUrl
          await Browser.open({
            url: 'app-settings:'
          });
          return true;
        } catch (error) {
          console.error('ScannerPermissionService: خطأ في فتح إعدادات iOS:', error);
          
          // عرض رسالة توضيحية
          await Toast.show({
            text: 'تعذر فتح إعدادات التطبيق، يرجى فتحها يدوياً',
            duration: 'long'
          });
          
          return false;
        }
      } 
      // في بيئة الويب أو منصات أخرى
      else {
        console.log('ScannerPermissionService: لا يمكن فتح الإعدادات على هذه المنصة:', platform);
        
        // عرض رسالة توضيحية
        await Toast.show({
          text: 'يرجى تفعيل إذن الكاميرا من إعدادات المتصفح',
          duration: 'long'
        });
        
        return false;
      }
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في فتح إعدادات التطبيق:', error);
      
      // عرض رسالة توضيحية
      await Toast.show({
        text: 'تعذر فتح إعدادات التطبيق، يرجى فتحها يدوياً',
        duration: 'long'
      });
      
      return false;
    }
  }
  
  /**
   * التحقق من دعم الماسح الضوئي
   */
  public async isSupported(): Promise<boolean> {
    try {
      console.log('ScannerPermissionService: التحقق من دعم الماسح الضوئي');
      
      // في بيئة التطبيق الأصلي
      if (Capacitor.isNativePlatform()) {
        // التحقق من وجود ملحقات الماسح الضوئي
        const hasMLKit = Capacitor.isPluginAvailable('MLKitBarcodeScanner');
        const hasCamera = Capacitor.isPluginAvailable('Camera');
        
        console.log('ScannerPermissionService: توفر MLKitBarcodeScanner:', hasMLKit);
        console.log('ScannerPermissionService: توفر Camera:', hasCamera);
        
        // إذا كان أي من الملحقين متاحًا، نعتبر أن الماسح الضوئي مدعوم
        return hasMLKit || hasCamera;
      }
      
      // في بيئة الويب، نتحقق من وجود واجهة برمجة الكاميرا
      const hasWebCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      console.log('ScannerPermissionService: توفر كاميرا الويب:', hasWebCamera);
      
      // تحقق إضافي من وجود كاميرات متصلة
      if (hasWebCamera) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const cameras = devices.filter(device => device.kind === 'videoinput');
          console.log('ScannerPermissionService: عدد الكاميرات المتاحة:', cameras.length);
          
          return cameras.length > 0;
        } catch (error) {
          console.error('ScannerPermissionService: خطأ في التحقق من الكاميرات المتاحة:', error);
        }
      }
      
      return hasWebCamera;
    } catch (error) {
      console.error('ScannerPermissionService: خطأ في التحقق من دعم الماسح الضوئي:', error);
      return false;
    }
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerPermissionService = ScannerPermissionService.getInstance();
