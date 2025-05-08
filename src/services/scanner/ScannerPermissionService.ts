import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';

/**
 * خدمة مسؤولة عن إدارة أذونات الماسح الضوئي
 */
export class ScannerPermissionService {
  private static instance: ScannerPermissionService;
  private permissionRequestAttempts = 0;
  private packageName = 'app.lovable.foodvault.manager'; // معرف حزمة التطبيق
  
  private constructor() {}
  
  public static getInstance(): ScannerPermissionService {
    if (!ScannerPermissionService.instance) {
      ScannerPermissionService.instance = new ScannerPermissionService();
    }
    return ScannerPermissionService.instance;
  }
  
  /**
   * فتح إعدادات التطبيق مباشرة للوصول لصفحة أذونات التطبيق
   */
  public async openAppSettings(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] محاولة فتح إعدادات التطبيق...');
      
      // إظهار توجيهات للمستخدم
      const platform = Capacitor.getPlatform();
      const settingsMessage = platform === 'ios' 
        ? 'سيتم توجيهك الآن إلى إعدادات التطبيق. الرجاء تمكين إذن الكاميرا.'
        : 'سيتم توجيهك الآن إلى إعدادات التطبيق. الرجاء الانتقال إلى "الأذونات" وتمكين إذن الكاميرا.';
      
      await Toast.show({
        text: settingsMessage,
        duration: 'long'
      });
      
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerPermissionService] فتح الإعدادات باستخدام MLKit...');
        await BarcodeScanner.openSettings();
        return true;
      }

      // استخدام App API بدلاً من Camera.openSettings
      if (platform === 'android') {
        console.log('[ScannerPermissionService] محاولة فتح إعدادات Android...');
        
        await Toast.show({
          text: 'يرجى فتح إعدادات جهازك وتمكين إذن الكاميرا للتطبيق يدويًا',
          duration: 'long'
        });
        
        // تقديم توجيه مفصل للمستخدم
        alert(
          'لتمكين إذن الكاميرا يدويًا:\n\n' +
          '1. افتح إعدادات جهازك\n' +
          '2. اختر "التطبيقات" أو "إدارة التطبيقات"\n' +
          '3. ابحث عن تطبيق "مخزن الطعام"\n' +
          '4. اختر "الأذونات"\n' +
          '5. اختر "الكاميرا" وقم بتمكينها\n\n' +
          'إذا لم يظهر التطبيق في قائمة التطبيقات, قم بتثبيت التطبيق مرة أخرى أو أعد تشغيل الهاتف'
        );
      }
      
      // الطريقة البديلة لنظام iOS
      if (platform === 'ios') {
        console.log('[ScannerPermissionService] استخدام طريقة الخروج لـ iOS...');
        await Toast.show({
          text: 'يرجى فتح إعدادات جهازك وتمكين إذن الكاميرا ثم إعادة فتح التطبيق',
          duration: 'long'
        });
        
        // تقديم توجيه مفصل للمستخدم
        alert(
          'لتمكين إذن الكاميرا على آيفون:\n\n' +
          '1. افتح إعدادات جهازك\n' +
          '2. اختر "الخصوصية والأمان"\n' +
          '3. اخت�� "الكاميرا"\n' +
          '4. ابحث عن تطبيق "مخزن الطعام" وقم بتفعيله'
        );
      }
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في فتح الإعدادات:', error);
      try {
        // توجيهات إضافية في حال فشل فتح الإعدادات
        await Toast.show({
          text: 'يرجى فتح إعدادات الجهاز وتمكين إذن الكاميرا للتطبيق يدويًا',
          duration: 'long'
        });
        
        // توجيهات أكثر تفصيلاً حسب نوع المنصة
        const platform = Capacitor.getPlatform();
        if (platform === 'android') {
          alert(
            'لتمكين إذن الكاميرا يدويًا:\n\n' +
            '1. افتح إعدادات جهازك\n' +
            '2. اختر "التطبيقات"\n' +
            '3. ابحث عن تطبيق "مخزن الطعام"\n' +
            '4. اختر "الأذونات"\n' +
            '5. قم بتمكين "الكاميرا"\n\n' +
            'بعد تمكين الإذن، أعد تشغيل التطبيق'
          );
        } else {
          alert(
            'لتمكين إذن الكاميرا:\n\n' +
            '1. افتح إعدادات جهازك\n' +
            '2. اختر "الخصوصية"\n' +
            '3. اختر "الكاميرا"\n' +
            '4. قم بتمكين الإذن لتطبيق "مخزن الطعام"\n\n' +
            'بعد تمكين الإذن، أعد تشغيل التطبيق'
          );
        }
      } catch (e) {
        console.error('[ScannerPermissionService] خطأ في عرض الرسالة:', e);
      }
      return false;
    }
  }
  
  /**
   * التحقق مما إذا كان الماسح مدعومًا على الجهاز
   */
  public async isSupported(): Promise<boolean> {
    try {
      // أولاً: التحقق من MLKit
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const result = await BarcodeScanner.isSupported();
        return result.supported;
      }
      
      // ثانياً: في بيئات الويب أو الأجهزة الأخرى، نفترض الدعم للتمكين من الاختبار
      return true;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من دعم الماسح:', error);
      // نفترض الدعم عند حدوث خطأ للسماح بالاختبار
      return true;
    }
  }
  
  /**
   * طلب إذن الكاميرا مع محاولات متعددة وبطرق مختلفة
   * تم تحسين الدالة لتعامل أفضل مع مشكلة التطبيق غير الظاهر في قائمة الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      this.permissionRequestAttempts++;
      console.log(`[ScannerPermissionService] طلب إذن الكاميرا، المحاولة ${this.permissionRequestAttempts}`);
      
      // جعل المحاولات أكثر مرونة لتجاوز مشاكل الأذونات على أجهزة مختلفة
      const maxAttempts = 2;
      let attemptCount = 0;
      
      // عرض رسالة توجيه للمستخدم
      await Toast.show({
        text: 'يرجى السماح بوصول التطبيق للكاميرا. هذا ضروري لمسح الباركود.',
        duration: 'long'
      });
      
      // محاولة متكرر�� للحصول على الإذن
      while (attemptCount < maxAttempts) {
        attemptCount++;
        console.log(`[ScannerPermissionService] محاولة رقم ${attemptCount} من ${maxAttempts}`);
        
        // طريقة 1: استخدام MLKit
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          try {
            console.log('[ScannerPermissionService] طلب الإذن باستخدام MLKit');
            const { camera } = await BarcodeScanner.requestPermissions();
            console.log('[ScannerPermissionService] نتيجة طلب الإذن من MLKit:', camera);
            
            if (camera === 'granted') {
              console.log('[ScannerPermissionService] تم منح الإذن بنجاح من MLKit');
              await Toast.show({
                text: 'تم منح إذن الكاميرا بنجاح!',
                duration: 'short'
              });
              return true;
            }
            
            // حل مشكلة عدم ظهور التطبيق في قائمة الكاميرا - لفت انتباه المستخدم للمحاولة مرة أخرى
            if (camera === 'denied' && attemptCount < maxAttempts) {
              console.log('[ScannerPermissionService] تم الرفض، إعطاء توضيح للمستخدم وإعادة المحاولة');
              await Toast.show({
                text: 'حدثت مشكلة في طلب الإذن. سنحاول مرة أخرى...',
                duration: 'short'
              });
              
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            
            if (camera === 'denied') {
              console.log('[ScannerPermissionService] تم رفض الإذن، توجيه المستخدم للإعدادات');
              await Toast.show({
                text: 'لم يتم منح إذن الكاميرا. سيتم توجيهك إلى إعدادات التطبيق.',
                duration: 'long'
              });
              
              setTimeout(() => this.openAppSettings(), 1000);
              return false;
            }
          } catch (e) {
            console.error('[ScannerPermissionService] خطأ في طلب الإذن من MLKit:', e);
          }
        }
        
        // طريقة 2: استخدام ملحق الكاميرا العادي
        if (Capacitor.isPluginAvailable('Camera')) {
          try {
            console.log('[ScannerPermissionService] طلب الإذن باستخدام ملحق الكاميرا');
            const { camera } = await Camera.requestPermissions({
              permissions: ['camera']
            });
            console.log('[ScannerPermissionService] نتيجة طلب الإذن من Camera:', camera);
            
            if (camera === 'granted') {
              console.log('[ScannerPermissionService] تم منح الإذن بنجاح من ملحق الكاميرا');
              await Toast.show({
                text: 'تم منح إذن الكاميرا بنجاح!',
                duration: 'short'
              });
              return true;
            }
          } catch (e) {
            console.error('[ScannerPermissionService] خطأ في طلب الإذن من ملحق الكاميرا:', e);
          }
        }
        
        // طريقة 3: API الويب للكاميرا
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            console.log('[ScannerPermissionService] طلب الإذن باستخدام navigator.mediaDevices');
            // هذا سيؤدي إلى فتح مربع حوار إذن على المتصفح
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            
            // تم منح الإذن، تنظيف الدفق
            stream.getTracks().forEach(track => track.stop());
            console.log('[ScannerPermissionService] تم منح إذن الكاميرا من API الويب');
            
            return true;
          } catch (mediaError) {
            console.log('[ScannerPermissionService] تم رفض إذن كاميرا الويب', mediaError);
          }
        }
        
        // انتظار قبل المحاولة التالية
        if (attemptCount < maxAttempts) {
          console.log('[ScannerPermissionService] انتظار قبل المحاولة التالية');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // بعد فشل جميع المحاولات
      console.log('[ScannerPermissionService] فشلت جميع المحاولات، توجيه المستخدم إلى الإعدادات');
      await Toast.show({
        text: 'لم نتمكن من الحصول على إذن الكاميرا بشكل تلقائي. سيتم توجيهك إلى إعدادات التطبيق.',
        duration: 'long'
      });
      
      // تأخير قصير قبل فتح الإعدادات
      setTimeout(() => this.openAppSettings(), 1500);
      
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * التحقق من حالة إذن الكاميرا بطرق متعددة
   */
  public async checkPermission(): Promise<boolean> {
    try {
      // طريقة 1: التحقق من MLKit
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerPermissionService] فحص حالة إذن الكاميرا عبر MLKit...');
        const { camera } = await BarcodeScanner.checkPermissions();
        console.log('[ScannerPermissionService] نتيجة فحص الإذن من MLKit:', camera);
        
        if (camera === 'granted') {
          return true;
        }
      }
      
      // طريقة 2: التحقق من ملحق الكاميرا
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('[ScannerPermissionService] فحص حالة إذن الكاميرا عبر ملحق الكاميرا...');
        const { camera } = await Camera.checkPermissions();
        console.log('[ScannerPermissionService] نتيجة فحص الإذن من Camera:', camera);
        
        if (camera === 'granted') {
          return true;
        }
      }
      
      // طريقة 3: محاولة الوصول للكاميرا مباشرة (للفحص)
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('[ScannerPermissionService] محاولة فحص إذن الكاميرا عبر MediaDevices API...');
        try {
          // هذا سيختبر إذا كان بالإمكان الوصول للكاميرا
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          console.log('[ScannerPermissionService] يمكن الوصول للكاميرا عبر MediaDevices API');
          return true;
        } catch (mediaError) {
          console.log('[ScannerPermissionService] لا يمكن الوصول للكاميرا عبر MediaDevices API', mediaError);
          return false;
        }
      }
      
      console.log('[ScannerPermissionService] لا يمكن التحقق من إذن الكاميرا بطريقة موثوقة');
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * إعادة تعيين محاولات طلب الإذن
   */
  public resetAttempts(): void {
    this.permissionRequestAttempts = 0;
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerPermissionService = ScannerPermissionService.getInstance();
