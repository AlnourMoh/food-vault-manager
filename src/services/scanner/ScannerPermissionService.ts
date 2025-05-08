
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
  private lastPermissionCheck = 0;
  private permissionStatus: boolean | null = null;
  
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
      
      // استخدام مكتبة مخصصة لتوجيه المستخدم حسب المنصة
      if (platform === 'android') {
        try {
          console.log('[ScannerPermissionService] فتح إعدادات Android');
          
          if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
            await BarcodeScanner.openSettings();
            return true;
          } else if (Capacitor.isPluginAvailable('App')) {
            // استخدام App plugin لإنهاء التطبيق بعد توجيه المستخدم لتغيير الإعدادات يدويًا
            await Toast.show({
              text: 'سيتم إغلاق التطبيق، الرجاء العودة وتمكين إذن الكاميرا من إعدادات الجهاز',
              duration: 'long'
            });
            await App.exitApp();
            return true;
          }
          
          // إرشادات يدوية للمستخدم
          await Toast.show({
            text: 'الرجاء اتباع هذه الخطوات يدوياً: اذهب إلى إعدادات الجهاز > التطبيقات > مخزن الطعام > الأذونات > الكاميرا',
            duration: 'long'
          });
        } catch (e) {
          console.error('[ScannerPermissionService] خطأ في فتح إعدادات Android:', e);
        }
      } 
      else if (platform === 'ios') {
        console.log('[ScannerPermissionService] محاولة فتح إعدادات iOS...');
        
        try {
          if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
            await BarcodeScanner.openSettings();
            return true;
          } else if (Capacitor.isPluginAvailable('App')) {
            // استخدام App plugin لإنهاء التطبيق بعد توجيه المستخدم لتغيير الإعدادات يدويًا
            await Toast.show({
              text: 'سيتم إغلاق التطبيق، الرجاء العودة وتمكين إذن الكاميرا من إعدادات الجهاز',
              duration: 'long'
            });
            await App.exitApp();
            return true;
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
      // التحقق من وجود ملحق MLKitBarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const result = await BarcodeScanner.isSupported();
          if (result.supported) {
            console.log('[ScannerPermissionService] MLKit BarcodeScanner مدعوم');
            return true;
          }
        } catch (e) {
          console.warn('[ScannerPermissionService] خطأ في التحقق من دعم MLKit:', e);
        }
      }
      
      // التحقق من وجود ملحق Camera
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('[ScannerPermissionService] ملحق Camera متاح على الجهاز');
        return true;
      }
      
      // التحقق من توفر الكاميرا عبر navigator
      if (Capacitor.getPlatform() === 'web' && 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        console.log('[ScannerPermissionService] واجهة برمجة تطبيقات الكاميرا متاحة في المتصفح');
        return true;
      }
      
      console.warn('[ScannerPermissionService] الماسح الضوئي غير مدعوم على هذا الجهاز');
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من دعم الماسح:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا بطرق متعددة مع محاولات متعددة
   */
  public async requestPermission(): Promise<boolean> {
    try {
      // التحقق أولاً من وجود دعم
      if (!await this.isSupported()) {
        await Toast.show({
          text: 'جهازك لا يدعم الماسح الضوئي أو لا توجد كاميرا متاحة',
          duration: 'long'
        });
        return false;
      }
      
      // تسجيل عدد محاولات طلب الإذن
      this.permissionRequests++;
      console.log(`[ScannerPermissionService] محاولة طلب الإذن رقم: ${this.permissionRequests}`);
      
      // التحقق من الإذن الحالي أولاً لتجنب طلب متكرر
      const currentPermission = await this.checkPermission();
      if (currentPermission) {
        console.log('[ScannerPermissionService] الإذن ممنوح بالفعل، لا داعي للطلب');
        this.permissionStatus = true;
        this.permissionRequests = 0;
        return true;
      }
      
      // محاولة طلب الإذن عبر ملحق MLKitBarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[ScannerPermissionService] محاولة طلب إذن عبر MLKitBarcodeScanner...');
        
        // إظهار رسالة توضيحية
        await Toast.show({
          text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود، سيتم طلب الإذن الآن',
          duration: 'short'
        });
        
        // طلب الإذن وفحص النتيجة
        const status = await BarcodeScanner.checkPermissions();
        if (status.camera === 'granted') {
          console.log('[ScannerPermissionService] إذن MLKit ممنوح بالفعل');
          this.permissionStatus = true;
          this.permissionRequests = 0;
          return true;
        }
        
        const requestResult = await BarcodeScanner.requestPermissions();
        
        if (requestResult.camera === 'granted') {
          console.log('[ScannerPermissionService] تم منح إذن MLKit بنجاح');
          this.permissionStatus = true;
          this.permissionRequests = 0;
          return true;
        } else {
          console.log('[ScannerPermissionService] تم رفض إذن MLKit:', requestResult.camera);
        }
      }
      
      // محاولة طلب الإذن عبر ملحق Camera
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('[ScannerPermissionService] محاولة طلب إذن عبر ملحق Camera...');
        
        // إظهار رسالة توضيحية
        await Toast.show({
          text: 'التطبيق يحتاج إلى إذن الكاميرا، يرجى السماح بالوصول',
          duration: 'short'
        });
        
        // طلب الإذن وفحص النتيجة
        const status = await Camera.checkPermissions();
        if (status.camera === 'granted') {
          console.log('[ScannerPermissionService] إذن الكاميرا ممنوح بالفعل');
          this.permissionStatus = true;
          this.permissionRequests = 0;
          return true;
        }
        
        const requestResult = await Camera.requestPermissions({
          permissions: ['camera']
        });
        
        if (requestResult.camera === 'granted') {
          console.log('[ScannerPermissionService] تم منح إذن الكاميرا بنجاح');
          this.permissionStatus = true;
          this.permissionRequests = 0;
          return true;
        } else {
          console.log('[ScannerPermissionService] تم رفض إذن الكاميرا:', requestResult.camera);
        }
      }
      
      // محاولة فتح الإعدادات بعد 3 محاولات من الرفض
      if (this.permissionRequests >= 2) {
        console.log('[ScannerPermissionService] وصلنا للمحاولة رقم', this.permissionRequests);
        
        await Toast.show({
          text: 'يبدو أنه تم رفض طلب إذن الكاميرا، سيتم توجيهك إلى الإعدادات لتمكين الإذن يدوياً',
          duration: 'long'
        });
        
        await this.openAppSettings();
      }
      
      // إذا وصلنا إلى هنا، فإن الإذن تم رفضه
      this.permissionStatus = false;
      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * التحقق من حالة إذن الكاميرا
   * مع تطبيق التخزين المؤقت للتحسين
   */
  public async checkPermission(): Promise<boolean> {
    try {
      // التحقق من وجود تخزين مؤقت حديث للإذن
      const now = Date.now();
      if (this.permissionStatus !== null && (now - this.lastPermissionCheck < 10000)) {
        console.log('[ScannerPermissionService] استخدام حالة الإذن المخزنة مؤقتاً:', this.permissionStatus);
        return this.permissionStatus;
      }
      
      let hasPermission = false;
      
      // التحقق من MLKitBarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const status = await BarcodeScanner.checkPermissions();
          hasPermission = status.camera === 'granted';
          console.log('[ScannerPermissionService] حالة إذن MLKit BarcodeScanner:', hasPermission);
        } catch (e) {
          console.warn('[ScannerPermissionService] خطأ في التحقق من إذن MLKit:', e);
        }
      }
      
      // التحقق من Camera إذا كان MLKit غير متاح أو لم يمنح الإذن
      if (!hasPermission && Capacitor.isPluginAvailable('Camera')) {
        try {
          const status = await Camera.checkPermissions();
          hasPermission = status.camera === 'granted';
          console.log('[ScannerPermissionService] حالة إذن Camera:', hasPermission);
        } catch (e) {
          console.warn('[ScannerPermissionService] خطأ في التحقق من إذن Camera:', e);
        }
      }
      
      // تحديث التخزين المؤقت
      this.lastPermissionCheck = now;
      this.permissionStatus = hasPermission;
      
      return hasPermission;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من حالة إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * إعادة تعيين بيانات الإذن المخزنة مؤقتاً
   * مفيدة إذا كنا نعتقد أن المستخدم قد غير الإذن يدوياً
   */
  public resetPermissionCache(): void {
    this.permissionStatus = null;
    this.lastPermissionCheck = 0;
    console.log('[ScannerPermissionService] تم إعادة تعيين بيانات الإذن المخزنة مؤقتاً');
  }
}

export const scannerPermissionService = ScannerPermissionService.getInstance();
