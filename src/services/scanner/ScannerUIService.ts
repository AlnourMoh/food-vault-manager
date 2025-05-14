
/**
 * خدمة للتعامل مع واجهة المستخدم أثناء المسح
 */
class ScannerUIService {
  private static instance: ScannerUIService;
  private originalStyles: Map<HTMLElement, {bg: string, opacity: string, visibility: string}> = new Map();
  
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
  public async setupUIForScanning(): Promise<void> {
    try {
      console.log('[ScannerUIService] إعداد واجهة المستخدم للمسح');
      
      // حفظ أنماط العناصر الأصلية وإخفاء العناصر التي قد تتداخل مع المسح
      const elementsToHide = document.querySelectorAll('header, footer, nav, .fixed-top, .fixed-bottom');
      
      elementsToHide.forEach(element => {
        if (element instanceof HTMLElement) {
          // حفظ الأنماط الأصلية
          this.originalStyles.set(element, {
            bg: element.style.background,
            opacity: element.style.opacity,
            visibility: element.style.visibility
          });
          
          // إضافة فئة وإخفاء العناصر
          element.classList.add('app-header');
          element.style.background = 'transparent';
          element.style.opacity = '0';
          element.style.visibility = 'hidden';
        }
      });
      
      // تعديل نمط الجسم للمسح
      document.body.style.overflow = 'hidden';
      document.body.style.backgroundColor = 'black';
    } catch (error) {
      console.error('[ScannerUIService] خطأ في إعداد واجهة المستخدم:', error);
    }
  }
  
  /**
   * استعادة واجهة المستخدم بعد المسح
   */
  public async restoreUIAfterScanning(): Promise<void> {
    try {
      console.log('[ScannerUIService] استعادة واجهة المستخدم بعد المسح');
      
      // استعادة العناصر المخفية
      document.querySelectorAll('.app-header').forEach(element => {
        if (element instanceof HTMLElement) {
          // استعادة الأنماط الأصلية
          const originalStyle = this.originalStyles.get(element);
          if (originalStyle) {
            element.style.background = originalStyle.bg;
            element.style.opacity = originalStyle.opacity;
            element.style.visibility = originalStyle.visibility;
          } else {
            element.style.background = '';
            element.style.opacity = '1';
            element.style.visibility = 'visible';
          }
          
          // إزالة الفئة
          element.classList.remove('app-header');
        }
      });
      
      // استعادة نمط الجسم
      document.body.style.overflow = '';
      document.body.style.backgroundColor = '';
      
      // مسح الأنماط المحفوظة
      this.originalStyles.clear();
    } catch (error) {
      console.error('[ScannerUIService] خطأ في استعادة واجهة المستخدم:', error);
      // مسح الأنماط المحفوظة في حالة الخطأ
      this.originalStyles.clear();
    }
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerUIService = ScannerUIService.getInstance();
