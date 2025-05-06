
import { useRef } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useScannerUI = () => {
  // تتبع العناصر المضافة للتمكن من إزالتها
  const addedElements = useRef<HTMLElement[]>([]);
  const addedClasses = useRef<{element: HTMLElement, classes: string[]}[]>([]);
  
  // تنظيف أي آثار سابقة
  const ensureCleanStartup = () => {
    console.log("[useScannerUI] تنظيف آثار الماسح السابقة");
    cleanupScannerBackground(true);
  };
  
  const setupScannerBackground = async () => {
    console.log("[useScannerUI] إعداد الخلفية للماسح");
    
    try {
      // تأكد أولاً من عدم وجود آثار سابقة
      ensureCleanStartup();
      
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
            addedClasses.current.push({
              element,
              classes: ['hidden-during-scan']
            });
          }
          
          // تسجيل العنصر لاستعادة الأنماط لاحقًا
          addedElements.current.push(element);
        }
      });
      
      // تعيين الخلفية للجسم والتوثيق بشكل مؤقت للمسح
      document.body.style.background = 'transparent';
      document.body.style.backgroundColor = 'transparent';
    } catch (error) {
      console.error("[useScannerUI] خطأ في إعداد خلفية الماسح:", error);
    }
  };

  const cleanupScannerBackground = async (force = false) => {
    console.log("[useScannerUI] تنظيف خلفية الماسح");
    
    try {
      // إزالة فئة الماسح النشط من الجسم
      document.body.classList.remove('scanner-active');
      
      // استعادة الأنماط الأصلية للعناصر
      for (const element of addedElements.current) {
        try {
          if (element) {
            element.style.display = '';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
          }
        } catch (e) {
          console.error("[useScannerUI] خطأ في استعادة الأنماط الأصلية للعنصر:", e);
        }
      }
      
      // إزالة الفئات المضافة
      for (const item of addedClasses.current) {
        try {
          if (item.element && item.element.classList) {
            for (const className of item.classes) {
              if (className) {
                item.element.classList.remove(className);
              }
            }
          }
        } catch (e) {
          console.error("[useScannerUI] خطأ في إزالة الفئات المضافة:", e);
        }
      }
      
      // إعادة تعيين المصفوفات
      addedElements.current = [];
      addedClasses.current = [];
      
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
      
      // إيقاف المسح في MLKit
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          await BarcodeScanner.disableTorch().catch(() => {});
          await BarcodeScanner.stopScan().catch(() => {});
        } catch (e) {
          console.warn("[useScannerUI] خطأ عند إيقاف مسح MLKit:", e);
        }
      }
    } catch (error) {
      console.error("[useScannerUI] خطأ في تنظيف خلفية الماسح:", error);
    }
  };

  return {
    setupScannerBackground,
    cleanupScannerBackground
  };
};
