
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
      
      // إضافة فئات للجسم
      const addClassesToElement = (element: HTMLElement, classes: string[]) => {
        element.classList.add(...classes);
        addedClasses.current.push({element, classes});
      };
      
      addClassesToElement(document.body, ['scanner-mode']);
      
      // تهيئة الماسح الضوئي بمكتبة MLKit
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const { supported } = await BarcodeScanner.isSupported();
          if (supported) {
            await BarcodeScanner.requestPermissions();
          }
        } catch (e) {
          console.warn('[useScannerUI] خطأ في تهيئة الماسح:', e);
        }
      }
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
      
      // إيقاف المسح إذا كان متاحًا
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          await BarcodeScanner.disableTorch().catch(() => {});
          await BarcodeScanner.stopScan().catch(() => {});
        } catch (e) {
          console.warn("[useScannerUI] خطأ عند إيقاف مسح MLKit:", e);
        }
      }
      
      // إعادة ظهور الهيدر والفوتر
      setTimeout(() => {
        document.querySelectorAll('.app-header, .app-footer').forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.background = 'white';
            el.style.backgroundColor = 'white';
            el.style.visibility = 'visible';
            el.style.opacity = '1';
          }
        });
      }, 300);
    } catch (error) {
      console.error("[useScannerUI] خطأ في تنظيف خلفية الماسح:", error);
    }
  };

  return {
    setupScannerBackground,
    cleanupScannerBackground
  };
};
