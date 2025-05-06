import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { App } from '@capacitor/app';

export class BarcodeScannerService {
  private static instance: BarcodeScannerService;
  private isScanning = false;
  private scanCleanupFunctions: (() => void)[] = [];
  
  private constructor() {}
  
  public static getInstance(): BarcodeScannerService {
    if (!BarcodeScannerService.instance) {
      BarcodeScannerService.instance = new BarcodeScannerService();
    }
    return BarcodeScannerService.instance;
  }
  
  /**
   * فتح إعدادات التطبيق
   */
  public async openAppSettings(): Promise<void> {
    try {
      console.log('[BarcodeScannerService] محاولة فتح إعدادات التطبيق...');
      
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[BarcodeScannerService] فتح الإعدادات باستخدام MLKit...');
        
        // استخدام مكتبة BarcodeScanner لفتح إعدادات التطبيق
        const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
        await BarcodeScanner.openSettings();
        return;
      }
      
      // الطريقة البديلة لفتح الإعدادات على نظام Android
      if (window.Capacitor?.getPlatform() === 'android') {
        console.log('[BarcodeScannerService] محاولة فتح إعدادات Android...');
        
        try {
          // استخدام intent مباشر لفتح إعدادات التطبيق
          const appId = 'app.lovable.foodvault.manager';
          
          // في Capacitor, نحتاج إلى فتح URL خاص لإعدادات التطبيق
          // ولكن App.openUrl و App.canOpenUrl غير متاح، لذا نستخدم Capacitor Browser إذا كان متاحًا
          if (window.Capacitor?.isPluginAvailable('Browser')) {
            const { Browser } = await import('@capacitor/browser');
            await Browser.open({ url: `package:${appId}` });
          } else {
            // إذا لم يكن Browser متاحًا، نستخدم طريقة exitApp ثم نعرض رسالة للمستخدم
            await Toast.show({
              text: 'يرجى فتح إعدادات جهازك وتمكين إذن الكاميرا للتطبيق يدويًا',
              duration: 'long'
            });
            setTimeout(() => App.exitApp(), 3000);
          }
          return;
        } catch (e) {
          console.error('[BarcodeScannerService] خطأ في فتح إعدادات Android:', e);
        }
      }
      
      // الطريقة البديلة لنظام iOS
      if (window.Capacitor?.getPlatform() === 'ios') {
        console.log('[BarcodeScannerService] استخدام طريقة الخروج لـ iOS...');
        await Toast.show({
          text: 'سيتم إغلاق التطبيق، يرجى فتح إعدادات جهازك وتمكين إذن الكاميرا ثم إعادة فتح التطبيق',
          duration: 'long'
        });
        setTimeout(() => App.exitApp(), 3000);
        return;
      }
      
      console.warn('[BarcodeScannerService] لا يمكن فتح الإعدادات تلقائيًا');
      await Toast.show({
        text: 'يرجى فتح إعدادات الجهاز وتمكين إذن الكاميرا للتطبيق يدويًا',
        duration: 'long'
      });
    } catch (error) {
      console.error('[BarcodeScannerService] خطأ في فتح الإعدادات:', error);
      try {
        await Toast.show({
          text: 'يرجى فتح إعدادات الجهاز وتمكين إذن الكاميرا للتطبيق يدويًا',
          duration: 'long'
        });
      } catch (e) {
        console.error('[BarcodeScannerService] خطأ في عرض الرسالة:', e);
        alert('يرجى فتح إعدادات الجهاز وتمكين إذن الكاميرا للتطبيق يدويًا');
      }
    }
  }
  
  /**
   * التحقق مما إذا كان الماسح مدعومًا على الجهاز
   */
  public async isSupported(): Promise<boolean> {
    try {
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        return false;
      }
      
      const result = await BarcodeScanner.isSupported();
      return result.supported;
    } catch (error) {
      console.error('[BarcodeScannerService] خطأ في التحقق من دعم ال��اسح:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      if (!await this.isSupported()) {
        console.log('[BarcodeScannerService] الماسح غير مدعوم');
        return false;
      }
      
      console.log('[BarcodeScannerService] طلب إذن الكاميرا من MLKit...');
      const { camera } = await BarcodeScanner.requestPermissions();
      console.log('[BarcodeScannerService] نتيجة طلب الإذن:', camera);
      
      return camera === 'granted';
    } catch (error) {
      console.error('[BarcodeScannerService] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * التحقق من حالة إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      if (!window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[BarcodeScannerService] MLKit غير متوفر');
        return false;
      }
      
      console.log('[BarcodeScannerService] فحص حالة إذن الكاميرا...');
      const { camera } = await BarcodeScanner.checkPermissions();
      console.log('[BarcodeScannerService] نتيجة فحص الإذن:', camera);
      
      return camera === 'granted';
    } catch (error) {
      console.error('[BarcodeScannerService] خطأ في التحقق من إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * فحص وإعداد كل ما هو مطلوب قبل بدء المسح
   */
  public async prepareScanner(): Promise<boolean> {
    // التحقق من دعم الماسح
    const isSupported = await this.isSupported();
    if (!isSupported) {
      console.log('[BarcodeScannerService] الماسح غير مدعوم على هذا الجهاز');
      // عرض رسالة للمستخدم أن الجهاز لا يدعم ماسح الباركود
      await Toast.show({
        text: 'هذا الجهاز لا يدعم ماسح الباركود',
        duration: 'long'
      });
      return false;
    }
    
    // التحقق من إذن الكاميرا
    const hasPermission = await this.checkPermission();
    if (!hasPermission) {
      console.log('[BarcodeScannerService] لا يوجد إذن للكاميرا، محاولة طلبه...');
      
      // عرض رسالة توضيحية قبل طلب الإذن
      await Toast.show({
        text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
        duration: 'short'
      });
      
      // طلب الإذن بعد ظهور الرسالة
      const permissionGranted = await this.requestPermission();
      if (!permissionGranted) {
        console.log('[BarcodeScannerService] تم رفض إذن الكاميرا');
        
        // عرض رسالة للمستخدم بعد رفض الإذن
        await Toast.show({
          text: 'تم رفض إذن الكاميرا. لا يمكن استخدام الماسح الضوئي بدون هذا الإذن.',
          duration: 'long'
        });
        return false;
      }
    }
    
    // محاولة تهيئة الكاميرا باستخدام مصباح الفلاش
    try {
      console.log('[BarcodeScannerService] تهيئة الكاميرا...');
      const torchResult = await BarcodeScanner.isTorchAvailable();
      if (torchResult.available) {
        // تشغيل وإيقاف الفلاش سريعاً لتنشيط الكاميرا
        await BarcodeScanner.enableTorch();
        setTimeout(async () => {
          try {
            await BarcodeScanner.disableTorch();
          } catch (e) {}
        }, 300);
      }
      
      // إخبار المستخدم أن الماسح جاهز
      await Toast.show({
        text: 'الماسح الضوئي جاهز للاستخدام',
        duration: 'short'
      });
    } catch (e) {
      console.log('[BarcodeScannerService] خطأ في التحقق من توفر الفلاش:', e);
    }
    
    return true;
  }
  
  /**
   * بدء عملية المسح - تحسين مع المزيد من المحاولات
   */
  public async startScan(onSuccess: (code: string) => void): Promise<boolean> {
    try {
      if (this.isScanning) {
        console.log('[BarcodeScannerService] الماسح نشط بالفعل');
        return true;
      }
      
      // عرض رسالة أن المسح سيبدأ
      await Toast.show({
        text: 'جاري تشغيل الماسح الضوئي... وجه الكاميرا إلى الباركود',
        duration: 'short'
      });
      
      // التأكد من جاهزية الماسح
      const isReady = await this.prepareScanner();
      if (!isReady) {
        console.log('[BarcodeScannerService] الماسح غير جاهز للاستخدام');
        return false;
      }
      
      // تعيين حالة المسح إلى نشط
      this.isScanning = true;
      
      // إعداد الواجهة للمسح
      this.setupUIForScanning();
      
      // بدء المسح الفعلي مع محاولات متعددة
      const MAX_RETRIES = 3;
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`[BarcodeScannerService] محاولة المسح ${attempt}/${MAX_RETRIES}...`);
          
          // بدء المسح مباشرة
          const result = await BarcodeScanner.scan({
            formats: ["QR_CODE", "UPC_E", "UPC_A", "EAN_8", "EAN_13", "CODE_39", "CODE_93", "CODE_128", "ITF", "CODABAR"]
          });
          
          // معالجة النتيجة
          if (result.barcodes && result.barcodes.length > 0) {
            const code = result.barcodes[0].rawValue || '';
            console.log(`[BarcodeScannerService] تم العثور على باركود: ${code}`);
            
            // تنظيف الواجهة وإيقاف المسح
            await this.stopScan();
            
            // استدعاء دالة النجاح مع الرمز
            onSuccess(code);
            return true;
          } else {
            console.log('[BarcodeScannerService] لم يتم العثور على باركود في هذه المحاولة');
            
            // إذا كانت هذه المحاولة الأخيرة، نتوقف
            if (attempt === MAX_RETRIES) {
              console.log('[BarcodeScannerService] استنفذت جميع المحاولات');
              break;
            }
            
            // إلا نستمر في المحاولة التالية
            await new Promise(resolve => setTimeout(resolve, 500)); // انتظار نصف ثانية قبل المحاولة التالية
          }
        } catch (error) {
          console.error(`[BarcodeScannerService] خطأ في محاولة المسح ${attempt}:`, error);
          
          // إذا كانت هذه المحاولة الأخيرة، نتوقف
          if (attempt === MAX_RETRIES) {
            console.log('[BarcodeScannerService] استنفذت جميع المحاولات');
            break;
          }
          
          // إلا نستمر في المحاولة التالية بعد انتظار قصير
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // إذا وصلنا إلى هنا، فهذا يعني أن جميع المحاولات فشلت
      await this.stopScan();
      
      // إظهار رسالة للمستخدم
      await Toast.show({
        text: 'لم يتم العثور على باركود. يرجى المحاولة مرة أخرى.',
        duration: 'long'
      });
      
      return false;
    } catch (error) {
      console.error('[BarcodeScannerService] خطأ في بدء المسح:', error);
      await this.stopScan();
      
      // إظهار رسالة خطأ للمستخدم
      await Toast.show({
        text: 'حدث خطأ أثناء المسح. يرجى المحاولة مرة أخرى.',
        duration: 'long'
      });
      
      return false;
    }
  }
  
  /**
   * إيقاف عملية المسح وتنظيف الموارد
   */
  public async stopScan(): Promise<void> {
    try {
      console.log('[BarcodeScannerService] إيقاف عملية المسح...');
      
      // تنفيذ وظائف التنظيف المسجلة
      for (const cleanup of this.scanCleanupFunctions) {
        try {
          cleanup();
        } catch (e) {
          console.error('[BarcodeScannerService] خطأ في تنفيذ وظيفة التنظيف:', e);
        }
      }
      
      // إعادة تعيين قائمة وظائف التنظيف
      this.scanCleanupFunctions = [];
      
      // استعادة الواجهة إلى حالتها الطبيعية
      this.restoreUIAfterScanning();
      
      // محاولة إيقاف المسح من خلال MLKit
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          await BarcodeScanner.disableTorch().catch(() => {});
          await BarcodeScanner.stopScan().catch(() => {});
        } catch (e) {
          console.log('[BarcodeScannerService] خطأ غير مهم عند إيقاف المسح:', e);
        }
      }
      
      // تعيين حالة المسح إلى غير نشط
      this.isScanning = false;
    } catch (error) {
      console.error('[BarcodeScannerService] خطأ في إيقاف المسح:', error);
      // تعيين حالة المسح إلى غير نشط حتى في حالة الخطأ
      this.isScanning = false;
    }
  }
  
  /**
   * إعداد الواجهة للمسح (الشفافية والتنسيق)
   */
  private setupUIForScanning(): void {
    console.log('[BarcodeScannerService] إعداد الواجهة للمسح...');
    
    // إضافة فئة للجسم للإشارة إلى أن الماسح نشط
    document.body.classList.add('scanner-active');
    
    // إخفاء الهيدر والفوتر أثناء المسح
    document.querySelectorAll('header, footer, nav').forEach(element => {
      if (element instanceof HTMLElement && !element.classList.contains('scanner-element')) {
        // تخزين الأنماط الأصلية لاستعادتها لاحقًا
        const originalDisplay = element.style.display;
        const originalVisibility = element.style.visibility;
        const originalOpacity = element.style.opacity;
        
        // تطبيق أنماط الإخفاء
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        
        // تسجيل وظيفة تنظيف لاستعادة الأنماط الأصلية
        this.scanCleanupFunctions.push(() => {
          if (element) {
            element.style.display = originalDisplay;
            element.style.visibility = originalVisibility;
            element.style.opacity = originalOpacity;
          }
        });
      }
    });
    
    // تعيين الخلفية للجسم والتوثيق بشكل مؤقت للمسح
    const originalBodyBg = document.body.style.background;
    const originalHtmlBg = document.documentElement.style.background;
    
    document.body.style.background = 'transparent';
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.background = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';
    
    // تسجيل وظيفة تنظيف لاستعادة الخلفية الأصلية
    this.scanCleanupFunctions.push(() => {
      document.body.style.background = originalBodyBg;
      document.body.style.backgroundColor = '';
      document.documentElement.style.background = originalHtmlBg;
      document.documentElement.style.backgroundColor = '';
    });
  }
  
  /**
   * استعادة الواجهة إلى حالتها الطبيعية بعد المسح
   */
  private restoreUIAfterScanning(): void {
    console.log('[BarcodeScannerService] استعادة الواجهة بعد المسح...');
    
    // إزالة فئة الماسح النشط من الجسم
    document.body.classList.remove('scanner-active');
    
    // استعادة ظهور الهيدر والفوتر
    document.querySelectorAll('header, footer, nav').forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.display = '';
        element.style.visibility = 'visible';
        element.style.opacity = '1';
      }
    });
    
    // تطبيق أنماط إضافية على الهيدر والفوتر لضمان عرضها بشكل صحيح
    setTimeout(() => {
      document.querySelectorAll('header, .app-header').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.background = 'white';
          el.style.backgroundColor = 'white';
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          el.style.zIndex = '1001';
        }
      });
      
      document.querySelectorAll('footer, nav, .app-footer').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.background = 'white';
          el.style.backgroundColor = 'white';
          el.style.opacity = '1';
          el.style.visibility = 'visible';
        }
      });
    }, 300);
  }
  
  /**
   * تنظيف الموارد والإعدادات
   */
  public cleanup(): void {
    this.stopScan().catch(e => 
      console.error('[BarcodeScannerService] خطأ في تنظيف الموارد:', e)
    );
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const barcodeScannerService = BarcodeScannerService.getInstance();
