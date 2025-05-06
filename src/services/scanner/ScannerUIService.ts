
/**
 * خدمة مسؤولة عن إدارة واجهة المستخدم للماسح الضوئي
 */
export class ScannerUIService {
  private static instance: ScannerUIService;
  private scanCleanupFunctions: (() => void)[] = [];
  
  private constructor() {}
  
  public static getInstance(): ScannerUIService {
    if (!ScannerUIService.instance) {
      ScannerUIService.instance = new ScannerUIService();
    }
    return ScannerUIService.instance;
  }
  
  /**
   * إعداد الواجهة للمسح (الشفافية والتنسيق)
   */
  public setupUIForScanning(): void {
    console.log('[ScannerUIService] إعداد الواجهة للمسح...');
    
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
  public restoreUIAfterScanning(): void {
    console.log('[ScannerUIService] استعادة الواجهة بعد المسح...');
    
    // إزالة فئة الماسح النشط من الجسم
    document.body.classList.remove('scanner-active');
    
    // تنفيذ وظائف التنظيف المسجلة
    for (const cleanup of this.scanCleanupFunctions) {
      try {
        cleanup();
      } catch (e) {
        console.error('[ScannerUIService] خطأ في تنفيذ وظيفة التنظيف:', e);
      }
    }
    
    // إعادة تعيين قائمة وظائف التنظيف
    this.scanCleanupFunctions = [];
    
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
    this.restoreUIAfterScanning();
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerUIService = ScannerUIService.getInstance();
