
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
  
  private constructor() {}
  
  public static getInstance(): ScannerPermissionService {
    if (!ScannerPermissionService.instance) {
      ScannerPermissionService.instance = new ScannerPermissionService();
    }
    return ScannerPermissionService.instance;
  }
  
  /**
   * فتح إعدادات التطبيق
   */
  public async openAppSettings(): Promise<void> {
    try {
      console.log('[ScannerPermissionService] محاولة فتح إعدادات التطبيق...');
      
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerPermissionService] فتح الإعدادات باستخدام MLKit...');
        await BarcodeScanner.openSettings();
        return;
      }
      
      // الطريقة البديلة لفتح الإعدادات على نظام Android
      if (Capacitor.getPlatform() === 'android') {
        console.log('[ScannerPermissionService] محاولة فتح إعدادات Android...');
        
        await Toast.show({
          text: 'يرجى فتح إعدادات جهازك وتمكين إذن الكاميرا للتطبيق يدويًا',
          duration: 'long'
        });
        
        // تقديم توجيه مفصل للمستخدم
        alert(
          'لتمكين إذن الكاميرا على أندرويد:\n\n' +
          '1. افتح إعدادات جهازك\n' +
          '2. اختر "التطبيقات" أو "إدارة التطبيقات"\n' +
          '3. ابحث عن تطبيق "مخزن الطعام"\n' +
          '4. اختر "الأذونات"\n' +
          '5. قم بتفعيل إذن "الكاميرا"'
        );
        
        setTimeout(() => App.exitApp(), 3000);
        return;
      }
      
      // الطريقة البديلة لنظام iOS
      if (Capacitor.getPlatform() === 'ios') {
        console.log('[ScannerPermissionService] استخدام طريقة الخروج لـ iOS...');
        await Toast.show({
          text: 'سيتم إغلاق التطبيق، يرجى فتح إعدادات جهازك وتمكين إذن الكاميرا ثم إعادة فتح التطبيق',
          duration: 'long'
        });
        
        // تقديم توجيه مفصل للمستخدم
        alert(
          'لتمكين إذن الكاميرا على آيفون:\n\n' +
          '1. افتح إعدادات جهازك\n' +
          '2. اختر "الخصوصية والأمان"\n' +
          '3. اختر "الكاميرا"\n' +
          '4. ابحث عن تطبيق "مخزن الطعام" وقم بتفعيله'
        );
        
        setTimeout(() => App.exitApp(), 3000);
        return;
      }
      
      console.warn('[ScannerPermissionService] لا يمكن فتح الإعدادات تلقائيًا');
      await Toast.show({
        text: 'يرجى فتح إعدادات الجهاز وتمكين إذن الكاميرا للتطبيق يدويًا',
        duration: 'long'
      });
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في فتح الإعدادات:', error);
      try {
        await Toast.show({
          text: 'يرجى فتح إعدادات الجهاز وتمكين إذن الكاميرا للتطبيق يدويًا',
          duration: 'long'
        });
      } catch (e) {
        console.error('[ScannerPermissionService] خطأ في عرض الرسالة:', e);
        alert('يرجى فتح إعدادات الجهاز وتمكين إذن الكاميرا للتطبيق يدويًا');
      }
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
   */
  public async requestPermission(): Promise<boolean> {
    try {
      this.permissionRequestAttempts++;
      console.log(`[ScannerPermissionService] طلب إذن الكاميرا، المحاولة ${this.permissionRequestAttempts}`);
      
      // إظهار رسالة للمستخدم
      await Toast.show({
        text: 'يرجى السماح باستخدام الكاميرا لمسح الباركود',
        duration: 'short'
      });
      
      // طريقة 1: استخدام MLKit
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerPermissionService] طلب الإذن باستخدام MLKit');
        const { camera } = await BarcodeScanner.requestPermissions();
        console.log('[ScannerPermissionService] نتيجة طلب الإذن من MLKit:', camera);
        
        if (camera === 'granted') {
          // تم منح الإذن
          return true;
        }
      }
      
      // طريقة 2: استخدام ملحق الكاميرا
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('[ScannerPermissionService] طلب الإذن باستخدام ملحق الكاميرا');
        const { camera } = await Camera.requestPermissions({
          permissions: ['camera']
        });
        console.log('[ScannerPermissionService] نتيجة طلب الإذن من Camera:', camera);
        
        if (camera === 'granted') {
          // تم منح الإذن
          return true;
        }
      }
      
      // طريقة 3: API الويب للكاميرا
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('[ScannerPermissionService] طلب الإذن باستخدام navigator.mediaDevices');
        try {
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
      
      // بعد فشل جميع المحاولات
      if (this.permissionRequestAttempts > 2) {
        console.log('[ScannerPermissionService] فشلت عدة محاولات، الانتقال إلى إعدادات التطبيق');
        await Toast.show({
          text: 'لم يتم منح الإذن بعد عدة محاولات، سيتم توجيهك إلى الإعدادات',
          duration: 'short'
        });
        
        setTimeout(() => this.openAppSettings(), 1500);
      }
      
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
