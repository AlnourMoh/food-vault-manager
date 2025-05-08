
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { App } from '@capacitor/app';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';

/**
 * خدمة للتعامل مع أذونات الكاميرا للماسح الضوئي
 */
class ScannerPermissionService {
  private static instance: ScannerPermissionService;
  private permissionRequests = 0;
  
  private constructor() {}
  
  public static getInstance(): ScannerPermissionService {
    if (!ScannerPermissionService.instance) {
      ScannerPermissionService.instance = new ScannerPermissionService();
    }
    return ScannerPermissionService.instance;
  }
  
  /**
   * فتح إعدادات التطبيق للسماح بتمكين الأذونات
   */
  public async openAppSettings(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] محاولة فتح إعدادات التطبيق...');
      
      // تحسين الإرشادات للمستخدم قبل فتح الإعدادات
      await Toast.show({
        text: 'سيتم الآن توجيهك إلى إعدادات التطبيق لتمكين إذن الكاميرا',
        duration: 'long'
      });
      
      const platform = Capacitor.getPlatform();
      
      // استخدام BarcodeScanner.openSettings للفتح في Android
      if (platform === 'android') {
        try {
          console.log('[ScannerPermissionService] فتح إعدادات Android عبر BarcodeScanner');
          
          // تسجيل محاولة فتح الإعدادات
          console.log('[ScannerPermissionService] محاولة فتح الإعدادات في:', new Date().toISOString());
          
          if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
            try {
              await BarcodeScanner.openSettings();
              
              await Toast.show({
                text: 'يرجى تمكين إذن الكاميرا من إعدادات التطبيق',
                duration: 'long'
              });
              
              return true;
            } catch (e) {
              console.error('[ScannerPermissionService] خطأ في فتح إعدادات BarcodeScanner:', e);
              
              // استخدام طريقة بديلة للتعامل مع الأجهزة المختلفة
              try {
                console.log('[ScannerPermissionService] استخدام طريقة بديلة لفتح الإعدادات');
                // توجيه المستخدم للإعدادات يدويًا
                await Toast.show({
                  text: 'يرجى فتح إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات',
                  duration: 'long'
                });
                return true;
              } catch (e2) {
                console.error('[ScannerPermissionService] خطأ في الطريقة البديلة:', e2);
              }
            }
          } else {
            // عرض رسالة إرشادية للمستخدم كبديل
            try {
              await Toast.show({
                text: 'يرجى فتح إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات > الكاميرا',
                duration: 'long'
              });
              return true;
            } catch (e) {
              console.error('[ScannerPermissionService] خطأ في عرض الرسالة الإرشادية:', e);
            }
          }
        } catch (e) {
          console.error('[ScannerPermissionService] خطأ في فتح إعدادات Android:', e);
        }
        
        // إرشادات يدوية للمستخدم في حالة عدم نجاح الطرق السابقة
        await Toast.show({
          text: 'الرجاء اتباع هذه الخطوات يدوياً: اذهب إلى إعدادات الجهاز > التطبيقات > مخزن الطعام > الأذونات > الكاميرا',
          duration: 'long'
        });
      } 
      // فتح إعدادات التطبيق في iOS
      else if (platform === 'ios') {
        console.log('[ScannerPermissionService] محاولة فتح إعدادات iOS...');
        
        try {
          // استخدام BarcodeScanner إذا كان متاحاً
          if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
            try {
              await BarcodeScanner.openSettings();
              return true;
            } catch (e2) {
              console.error('[ScannerPermissionService] خطأ في فتح إعدادات BarcodeScanner في iOS:', e2);
            }
          }
          
          // إرشادات يدوية للمستخدم
          await Toast.show({
            text: 'الرجاء اتباع هذه الخطوات يدوياً: افتح تطبيق الإعدادات > الخصوصية > الكاميرا > وقم بتفعيل تطبيق مخزن الطعام',
            duration: 'long'
          });
        } catch (error) {
          console.error('[ScannerPermissionService] خطأ في فتح إعدادات iOS:', error);
        }
      } else {
        // إذا كانت المنصة غير معروفة، نعرض رسالة عامة
        await Toast.show({
          text: 'لم نتمكن من فتح إعدادات التطبيق تلقائيًا. يرجى فتح إعدادات هاتفك وتمكين إذن الكاميرا للتطبيق.',
          duration: 'long'
        });
      }
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في فتح إعدادات التطبيق:', error);
      return false;
    }
  }
  
  /**
   * التحقق من دعم الماسح الضوئي على الجهاز
   */
  public async isSupported(): Promise<boolean> {
    try {
      // التحقق من توفر الكاميرا
      if (Capacitor.isPluginAvailable('Camera')) {
        return true;
      }
      
      // التحقق من توفر MLKit BarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const result = await BarcodeScanner.isSupported();
          return result.supported;
        } catch (e) {
          console.error('[ScannerPermissionService] خطأ في التحقق من دعم MLKit:', e);
        }
      }
      
      // التحقق من توفر الكاميرا عبر navigator
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من دعم الماسح:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا بطرق متعددة
   */
  public async requestPermission(): Promise<boolean> {
    try {
      // تسجيل عدد محاولات طلب الإذن
      this.permissionRequests++;
      console.log(`[ScannerPermissionService] محاولة طلب الإذن رقم: ${this.permissionRequests}`);
      
      // بعد 3 محاولات، نحاول مباشرة فتح الإعدادات
      if (this.permissionRequests > 3) {
        console.log('[ScannerPermissionService] تجاوزنا عدد المحاولات، سننتقل إلى إعدادات التطبيق مباشرة');
        
        await Toast.show({
          text: 'يبدو أننا نواجه صعوبة في الحصول على إذن الكاميرا. سنوجهك إلى الإعدادات لتمكين الإذن يدويًا.',
          duration: 'long'
        });
        
        setTimeout(() => this.openAppSettings(), 1500);
        return false;
      }
      
      // تحقق مما إذا كانت الكاميرا متوفرة
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerPermissionService] محاولة طلب إذن MLKit BarcodeScanner...');
        
        // التحقق من حالة الإذن الحالية
        const status = await BarcodeScanner.checkPermissions();
        
        if (status.camera === 'granted') {
          console.log('[ScannerPermissionService] إذن MLKit ممنوح بالفعل');
          return true;
        }
        
        // إظهار رسالة توضيحية قبل طلب الإذن
        await Toast.show({
          text: 'سنطلب إذن الكاميرا لمسح الباركود، التطبيق يستخدم الكاميرا فقط لمسح الباركود',
          duration: 'short'
        });
        
        // طلب الإذن من MLKit
        const requestResult = await BarcodeScanner.requestPermissions();
        
        if (requestResult.camera === 'granted') {
          console.log('[ScannerPermissionService] تم منح إذن MLKit بنجاح');
          this.permissionRequests = 0; // إعادة تعيين العداد عند النجاح
          return true;
        } else {
          console.log('[ScannerPermissionService] تم رفض إذن MLKit:', requestResult.camera);
          
          // إظهار رسالة توضيحية للمستخدم
          await Toast.show({
            text: 'تم رفض إذن الكاميرا. بدون هذا الإذن، لن يتمكن التطبيق من مسح الباركود.',
            duration: 'long'
          });
          
          // محاولة فتح إعدادات التطبيق
          setTimeout(() => this.openAppSettings(), 1500);
          return false;
        }
      } else if (Capacitor.isPluginAvailable('Camera')) {
        console.log('[ScannerPermissionService] محاولة طلب إذن الكاميرا العادية...');
        
        // التحقق من حالة الإذن
        const status = await Camera.checkPermissions();
        
        if (status.camera === 'granted') {
          console.log('[ScannerPermissionService] إذن الكاميرا ممنوح بالفعل');
          return true;
        }
        
        // إظهار رسالة توضيحية قبل طلب الإذن
        await Toast.show({
          text: 'سنطلب إذن الكاميرا الآن، يرجى السماح للتطبيق بالوصول إلى الكاميرا',
          duration: 'short'
        });
        
        // طلب الإذن
        const requestResult = await Camera.requestPermissions({
          permissions: ['camera']
        });
        
        // التحقق من نجاح الطلب
        if (requestResult.camera === 'granted') {
          console.log('[ScannerPermissionService] تم منح إذن الكاميرا العادية بنجاح');
          this.permissionRequests = 0; // إعادة تعيين العداد عند النجاح
          return true;
        } else {
          console.log('[ScannerPermissionService] تم رفض إذن الكاميرا العادية:', requestResult.camera);
          
          // محاولة فتح إعدادات التطبيق
          setTimeout(() => this.openAppSettings(), 1500);
          return false;
        }
      } else if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        console.log('[ScannerPermissionService] محاولة طلب إذن الكاميرا عبر navigator...');
        
        try {
          // طلب إذن الكاميرا عبر navigator
          await navigator.mediaDevices.getUserMedia({ video: true });
          console.log('[ScannerPermissionService] تم منح إذن الكاميرا عبر navigator بنجاح');
          this.permissionRequests = 0; // إعادة تعيين العداد عند النجاح
          return true;
        } catch (e) {
          console.log('[ScannerPermissionService] تم رفض إذن الكاميرا عبر navigator');
          
          // محاولة فتح إعدادات التطبيق
          setTimeout(() => this.openAppSettings(), 1500);
          return false;
        }
      } else {
        console.log('[ScannerPermissionService] لا يوجد دعم للكاميرا');
        
        // إظهار رسالة توضيحية للمستخدم
        await Toast.show({
          text: 'لم نتمكن من العثور على كاميرا متاحة على جهازك. يرجى التأكد من أن جهازك يدعم الكاميرا.',
          duration: 'long'
        });
        
        return false;
      }
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * التحقق من حالة إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const status = await BarcodeScanner.checkPermissions();
        return status.camera === 'granted';
      } else if (Capacitor.isPluginAvailable('Camera')) {
        const status = await Camera.checkPermissions();
        return status.camera === 'granted';
      }
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * التأكد من منح أذونات الكاميرا - محاولة قوية
   * يحاول بكل الوسائل المتاحة الحصول على الإذن
   */
  public async ensureCameraPermissions(): Promise<boolean> {
    console.log('[ScannerPermissionService] محاولة التأكد من منح أذونات الكاميرا');
    
    try {
      // التحقق من الإذن الحالي أولاً
      const hasPermission = await this.checkPermission();
      
      if (hasPermission) {
        console.log('[ScannerPermissionService] الإذن ممنوح بالفعل');
        return true;
      }
      
      console.log('[ScannerPermissionService] الإذن غير ممنوح، سنحاول طلبه');
      
      // طلب الإذن
      const granted = await this.requestPermission();
      
      if (granted) {
        return true;
      }
      
      // إذا لم ننجح، نعرض إرشادات وافية للمستخدم
      const platform = Capacitor.getPlatform();
      
      if (platform === 'android') {
        await Toast.show({
          text: 'لتمكين إذن الكاميرا يدوياً:\n1. اذهب إلى إعدادات الجهاز\n2. التطبيقات\n3. مخزن الطعام\n4. الأذونات\n5. الكاميرا\n6. اختر "السماح"',
          duration: 'long'
        });
      } else if (platform === 'ios') {
        await Toast.show({
          text: 'لتمكين إذن الكاميرا يدوياً:\n1. افتح تطبيق الإعدادات\n2. اختر الخصوصية\n3. اختر الكاميرا\n4. قم بتفعيل تطبيق مخزن الطعام',
          duration: 'long'
        });
      }
      
      // فتح إعدادات التطبيق
      await this.openAppSettings();
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التأكد من منح أذونات الكاميرا:', error);
      return false;
    }
  }
}

export const scannerPermissionService = ScannerPermissionService.getInstance();
