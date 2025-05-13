
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

/**
 * خدمة لإدارة واجهة المستخدم للماسح الضوئي
 */
export class ScannerUIService {
  private static instance: ScannerUIService;
  private originalStyles: Map<HTMLElement, { background: string, opacity: string }> = new Map();
  
  private constructor() {}
  
  public static getInstance(): ScannerUIService {
    if (!ScannerUIService.instance) {
      ScannerUIService.instance = new ScannerUIService();
    }
    return ScannerUIService.instance;
  }
  
  /**
   * إعداد واجهة المستخدم لعملية المسح
   */
  public setupUIForScanning(): void {
    try {
      console.log('[ScannerUIService] إعداد واجهة المستخدم للمسح');
      
      // حفظ الأنماط الأصلية للعناصر
      this.saveOriginalStyles();
      
      // إضافة فئة CSS للجسم
      document.body.classList.add('scanner-active');
      
      // تعيين متغير CSS لاستخدامه في أنماط CSS
      document.documentElement.style.setProperty('--scanner-active', '1');
      
      // إخفاء أو تعديل العناصر التي قد تتداخل مع المسح
      this.hideInterfaceElements();
      
      // إظهار خلفية الكاميرا إذا كان ذلك متاحًا
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        BarcodeScanner.showBackground().catch(error => {
          console.error('[ScannerUIService] خطأ في إظهار خلفية الكاميرا:', error);
        });
      }
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
      
      // إزالة فئة CSS من الجسم
      document.body.classList.remove('scanner-active');
      
      // إعادة تعيين متغير CSS
      document.documentElement.style.setProperty('--scanner-active', '0');
      
      // استعادة العناصر المخفية
      this.restoreInterfaceElements();
      
      // إخفاء خلفية الكاميرا إذا كان ذلك متاحًا
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        BarcodeScanner.hideBackground().catch(error => {
          console.error('[ScannerUIService] خطأ في إخفاء خلفية الكاميرا:', error);
        });
      }
    } catch (error) {
      console.error('[ScannerUIService] خطأ في استعادة واجهة المستخدم بعد المسح:', error);
    }
  }
  
  /**
   * حفظ الأنماط الأصلية للعناصر
   */
  private saveOriginalStyles(): void {
    // العناصر التي نحتاج إلى حفظ أنماطها
    const elementsToSave = document.querySelectorAll('header, nav, footer, .app-header, .app-navigation');
    
    elementsToSave.forEach(el => {
      if (el instanceof HTMLElement) {
        this.originalStyles.set(el, {
          background: el.style.background,
          opacity: el.style.opacity
        });
      }
    });
  }
  
  /**
   * إخفاء عناصر الواجهة التي قد تتداخل مع المسح
   */
  private hideInterfaceElements(): void {
    // العناصر التي نحتاج إلى إخفائها أو تعديلها
    const elementsToModify = document.querySelectorAll('header, nav, footer, .app-header, .app-navigation');
    
    elementsToModify.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.background = 'transparent';
        el.style.opacity = '0';
      }
    });
  }
  
  /**
   * استعادة عناصر الواجهة إلى حالتها الأصلية
   */
  private restoreInterfaceElements(): void {
    // استعادة جميع العناصر التي تم تعديلها
    this.originalStyles.forEach((styles, el) => {
      el.style.background = styles.background;
      el.style.opacity = styles.opacity;
    });
    
    // تفريغ المخزن
    this.originalStyles.clear();
  }
}

// تصدير نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerUIService = ScannerUIService.getInstance();
