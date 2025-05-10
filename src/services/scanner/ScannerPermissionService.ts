
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
          const status = await BarcodeScanner.checkPermissions();
          const isGranted = status.camera === 'granted';
          console.log('ScannerPermissionService: نتيجة فحص MLKitBarcodeScanner:', isGranted);
          return isGranted;
        }
        
        if (Capacitor.isPluginAvailable('Camera')) {
          console.log('ScannerPermissionService: استخدام Camera لفحص الإذن');
          const status = await Camera.checkPermissions();
          const isGranted = status.camera === 'granted';
          console.log('ScannerPermissionService: نتيجة فحص Camera:', isGranted);
          return isGranted;
        }
      }
      
      // في بيئة الويب، افترض أن الإذن ممنوح لتسهيل الاختبار
      if (!Capacitor.isNativePlatform()) {
        console.log('ScannerPermissionService: في وضع الويب، نفترض أن الإذن سيتم طلبه لاحقًا');
        return true;
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
      
      // طلب الإذن بناءً على البيئة
      if (Capacitor.isNativePlatform()) {
        // طلب الإذن في البيئة الأصلية (تطبيق جوال)
        console.log('ScannerPermissionService: طلب إذن الكاميرا في بيئة التطبيق الأصلي');
        
        // استخدام MLKit إذا كان متاحًا
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('ScannerPermissionService: استخدام MLKitBarcodeScanner لطلب الإذن');
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
        }
        
        // استخدام Camera إذا كان متاحًا
        if (Capacitor.isPluginAvailable('Camera')) {
          console.log('ScannerPermissionService: استخدام Camera لطلب الإذن');
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
        }
      } else {
        // في بيئة الويب، افترض أن الإذن ممنوح لتسهيل الاختبار
        console.log('ScannerPermissionService: في وضع الويب، نفترض أن الإذن سيتم طلبه لاحقًا');
        return true;
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
        await BarcodeScanner.openSettings();
        return true;
      }
      
      // عرض إرشادات للمستخدم حسب المنصة
      if (platform === 'ios') {
        await Toast.show({
          text: 'يرجى فتح إعدادات جهازك > الخصوصية > الكاميرا، وتمكين إذن الكاميرا للتطبيق',
          duration: 'long'
        });
      } else if (platform === 'android') {
        await Toast.show({
          text: 'يرجى فتح إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات > الكاميرا',
          duration: 'long'
        });
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
          const result = await BarcodeScanner.isSupported();
          return result.supported;
        }
      }
      
      // في بيئة الويب، نتحقق من دعم getUserMedia
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        return true;
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
