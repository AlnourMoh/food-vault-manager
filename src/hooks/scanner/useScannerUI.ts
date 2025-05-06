
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
      
      // جعل الخلفية شفافة
      document.documentElement.style.setProperty('--background', 'transparent', 'important');
      document.body.style.background = 'transparent';
      document.body.style.backgroundColor = 'transparent';
      
      // إضافة فئات للجسم
      document.body.classList.add('scanner-mode');
      addedClasses.current.push({element: document.body, classes: ['scanner-mode']});
      
      // إخفاء العناصر التي يمكن أن تتداخل مع المسح
      document.querySelectorAll('header, footer, nav').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = 'none';
          el.classList.add('app-header');
          addedClasses.current.push({element: el, classes: ['app-header']});
        }
      });
    } catch (error) {
      console.error("[useScannerUI] خطأ في إعداد خلفية الماسح:", error);
    }
  };

  const cleanupScannerBackground = async (force = false) => {
    console.log("[useScannerUI] تنظيف خلفية الماسح");
    
    try {
      // إزالة الفئات المضافة
      for (const {element, classes} of addedClasses.current) {
        if (element) {
          element.classList.remove(...classes);
        }
      }
      addedClasses.current = [];
      
      // إزالة فئات من عناصر معروفة
      document.body.classList.remove('scanner-mode');
      
      // إعادة إظهار العناصر المخفية
      document.querySelectorAll('.app-header').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = '';
          el.style.visibility = 'visible';
        }
      });
      
      // إعادة ضبط الخلفية
      document.documentElement.style.removeProperty('--background');
      document.body.style.background = '';
      document.body.style.backgroundColor = '';
      
      // إعادة ظهور الهيدر والفوتر
      setTimeout(() => {
        document.querySelectorAll('header, footer, nav').forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.display = '';
            el.style.visibility = 'visible';
            el.style.opacity = '1';
          }
        });
      }, 300);
      
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
