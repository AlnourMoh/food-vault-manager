
/**
 * خدمة لإدارة واجهة المستخدم المتعلقة بالماسح الضوئي
 */
export class ScannerUIService {
  private static instance: ScannerUIService;
  private addedElements: HTMLElement[] = [];
  private addedClasses: {element: HTMLElement, classes: string[]}[] = [];
  
  private constructor() {}
  
  public static getInstance(): ScannerUIService {
    if (!ScannerUIService.instance) {
      ScannerUIService.instance = new ScannerUIService();
    }
    return ScannerUIService.instance;
  }
  
  /**
   * إعداد واجهة المستخدم للمسح الضوئي
   */
  public setupUIForScanning(): void {
    try {
      console.log('[ScannerUIService] إعداد واجهة المستخدم للمسح');
      
      // تنظيف أي آثار سابقة
      this.cleanup();
      
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
          
          if (element.classList && element.classList.contains) {
            element.classList.add('hidden-during-scan');
            
            // تسجيل العنصر لإزالة الفئة لاحقًا
            this.addedClasses.push({
              element,
              classes: ['hidden-during-scan']
            });
          }
          
          // تسجيل العنصر لاستعادة الأنماط لاحقًا
          this.addedElements.push(element);
        }
      });
      
      // تعيين الخلفية للجسم والتوثيق بشكل مؤقت للمسح
      document.body.style.background = 'transparent';
      document.body.style.backgroundColor = 'transparent';
    } catch (error) {
      console.error('[ScannerUIService] خطأ في إعداد واجهة المستخدم للمسح:', error);
    }
  }
  
  /**
   * استعادة واجهة المستخدم بعد المسح
   */
  public restoreUIAfterScanning(): void {
    try {
      console.log('[ScannerUIService] استعادة واجهة المستخدم بعد المسح');
      
      // إزالة فئة الماسح النشط من الجسم
      document.body.classList.remove('scanner-active');
      
      // استعادة الأنماط الأصلية للعناصر
      for (const element of this.addedElements) {
        try {
          if (element) {
            element.style.display = '';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
          }
        } catch (e) {
          console.error('[ScannerUIService] خطأ في استعادة الأنماط الأصلية للعنصر:', e);
        }
      }
      
      // إزالة الفئات المضافة
      for (const item of this.addedClasses) {
        try {
          if (item.element && item.element.classList) {
            for (const className of item.classes) {
              if (className) {
                item.element.classList.remove(className);
              }
            }
          }
        } catch (e) {
          console.error('[ScannerUIService] خطأ في إزالة الفئات المضافة:', e);
        }
      }
      
      // إعادة تعيين المصفوفات
      this.addedElements = [];
      this.addedClasses = [];
      
      // استعادة الخلفية الأصلية للجسم
      document.body.style.background = '';
      document.body.style.backgroundColor = '';
      
      // تأكيد إظهار الهيدر والفوتر
      setTimeout(() => {
        document.querySelectorAll('header, footer, nav, .app-header').forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.display = '';
            el.style.visibility = 'visible';
            el.style.opacity = '1';
          }
        });
      }, 200);
    } catch (error) {
      console.error('[ScannerUIService] خطأ في استعادة واجهة المستخدم بعد المسح:', error);
    }
  }
  
  /**
   * تنظيف الموارد
   */
  public cleanup(): void {
    this.restoreUIAfterScanning();
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerUIService = ScannerUIService.getInstance();
