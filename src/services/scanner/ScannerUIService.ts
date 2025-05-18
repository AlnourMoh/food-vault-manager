
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
      
      // تعديل نمط الجسم للمسح - لا تجعل الخلفية سوداء
      document.body.style.overflow = 'hidden';
      
      // تأكد من أن عناصر الكاميرا مرئية
      this.updateVideoVisibility(true);
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
      
      // مسح الأنماط المحفوظة
      this.originalStyles.clear();
      
      // تحديث رؤية الفيديو
      this.updateVideoVisibility(false);
    } catch (error) {
      console.error('[ScannerUIService] خطأ في استعادة واجهة المستخدم:', error);
      // مسح الأنماط المحفوظة في حالة الخطأ
      this.originalStyles.clear();
    }
  }
  
  /**
   * تحديث رؤية عناصر الفيديو
   * هذه الوظيفة تساعد في حل مشكلة الشاشة السوداء
   */
  public updateVideoVisibility(visible: boolean): void {
    try {
      // البحث عن جميع عناصر الفيديو
      const videoElements = document.querySelectorAll('video');
      console.log(`[ScannerUIService] تحديث رؤية ${videoElements.length} عناصر فيديو، الحالة: ${visible ? 'مرئي' : 'مخفي'}`);
      
      videoElements.forEach((video, index) => {
        if (video instanceof HTMLVideoElement) {
          // إضافة فئة للتعرف على عناصر الفيديو الخاصة بالماسح
          video.classList.add('scanner-video');
          
          // تطبيق أنماط الرؤية المحسنة
          video.style.opacity = '1';
          video.style.visibility = 'visible';
          video.style.display = 'block';
          video.style.zIndex = '999';
          
          // إضافة أنماط إضافية لتجاوز أي مشاكل في CSS
          video.style.position = 'relative';
          if (visible) {
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            
            // محاولة لتشغيل الفيديو إذا كان متوقفاً
            if (video.paused && video.srcObject) {
              console.log(`[ScannerUIService] محاولة تشغيل فيديو #${index}`);
              video.play().catch(err => {
                console.warn('[ScannerUIService] تعذر تشغيل الفيديو:', err);
              });
            }
          }
        }
      });
      
      // إنشاء عنصر حاوية للفيديو إذا لم يكن موجوداً
      if (visible && videoElements.length > 0) {
        let containerElement = document.getElementById('barcode-scanner-view');
        if (!containerElement) {
          containerElement = document.createElement('div');
          containerElement.id = 'barcode-scanner-view';
          containerElement.style.position = 'relative';
          containerElement.style.width = '100%';
          containerElement.style.height = '100%';
          containerElement.style.overflow = 'hidden';
          containerElement.style.zIndex = '10';
          document.body.appendChild(containerElement);
        }
        
        // نقل الفيديو الأول إلى داخل الحاوية إذا لم يكن موجوداً بداخلها
        const firstVideo = videoElements[0] as HTMLVideoElement;
        if (!containerElement.contains(firstVideo)) {
          const videoClone = firstVideo.cloneNode(true) as HTMLVideoElement;
          videoClone.style.position = 'absolute';
          videoClone.style.left = '0';
          videoClone.style.top = '0';
          videoClone.style.width = '100%';
          videoClone.style.height = '100%';
          videoClone.style.objectFit = 'cover';
          videoClone.style.zIndex = '5';
          containerElement.appendChild(videoClone);
          
          console.log('[ScannerUIService] تم نقل الفيديو إلى حاوية العرض');
        }
      }
    } catch (error) {
      console.error('[ScannerUIService] خطأ في تحديث رؤية الفيديو:', error);
    }
  }
  
  /**
   * إنشاء عنصر فيديو مخصص للماسح
   * يمكن استخدام هذه الطريقة كحل احتياطي
   */
  public createScannerVideo(): HTMLVideoElement | null {
    try {
      // إنشاء عنصر فيديو جديد
      const video = document.createElement('video');
      video.id = 'scanner-video-' + Date.now();
      video.classList.add('scanner-video');
      
      // تعيين الخصائص الضرورية
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      
      // تطبيق الأنماط
      video.style.position = 'absolute';
      video.style.left = '0';
      video.style.top = '0';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.opacity = '1';
      video.style.visibility = 'visible';
      video.style.display = 'block';
      video.style.zIndex = '999';
      
      // إنشاء حاوية للفيديو إذا لم تكن موجودة
      let containerElement = document.getElementById('barcode-scanner-view');
      if (!containerElement) {
        containerElement = document.createElement('div');
        containerElement.id = 'barcode-scanner-view';
        containerElement.style.position = 'relative';
        containerElement.style.width = '100%';
        containerElement.style.height = '100%';
        containerElement.style.overflow = 'hidden';
        containerElement.style.zIndex = '10';
        document.body.appendChild(containerElement);
      }
      
      // إضافة الفيديو إلى الحاوية
      containerElement.appendChild(video);
      
      console.log('[ScannerUIService] تم إنشاء عنصر فيديو جديد للماسح');
      
      return video;
    } catch (error) {
      console.error('[ScannerUIService] خطأ في إنشاء عنصر فيديو:', error);
      return null;
    }
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerUIService = ScannerUIService.getInstance();
