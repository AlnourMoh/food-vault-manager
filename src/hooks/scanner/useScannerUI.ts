
import styles from '@/components/mobile/scanner/scanner.module.css';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { useState, useRef } from 'react';

export const useScannerUI = () => {
  // تحسين رصد وتتبع العناصر المضافة للتمكن من إزالتها بشكل كامل
  const addedElements = useRef<HTMLElement[]>([]);
  const addedClasses = useRef<{element: HTMLElement, classes: string[]}[]>([]);
  
  // تعريف ثوابت للمعرفات
  const SCANNER_VIEWPORT_ID = 'scanner-viewport-element';
  const SCANNER_PORTAL_ID = 'scanner-portal-container';
  const SCANNER_ROOT_ID = 'scanner-root-element';
  
  // تنظيف أي آثار سابقة قد تكون موجودة
  const ensureCleanStartup = () => {
    console.log("[useScannerUI] التأكد من إزالة أي آثار سابقة للماسح");
    cleanupScannerBackground(true);
  };
  
  const setupScannerBackground = async () => {
    console.log("[useScannerUI] إعداد خلفية الماسح الضوئي والكاميرا");
    
    try {
      // تأكد أولاً من عدم وجود أي آثار سابقة
      ensureCleanStartup();
      
      // إنشاء عنصر الرؤية للماسح بطريقة منظمة
      const createAndTrackElement = (id: string, className: string, parent: HTMLElement = document.body) => {
        const existingElement = document.getElementById(id);
        if (existingElement) existingElement.remove();
        
        const element = document.createElement('div');
        element.id = id;
        element.className = className;
        parent.appendChild(element);
        addedElements.current.push(element);
        return element;
      };
      
      // إنشاء العناصر بشكل منظم
      const rootElement = createAndTrackElement(SCANNER_ROOT_ID, styles.scannerRoot);
      const viewportElement = createAndTrackElement(SCANNER_VIEWPORT_ID, styles.cameraViewport, rootElement);
      const portalElement = createAndTrackElement(SCANNER_PORTAL_ID, styles.scannerPortal, rootElement);
      
      // إضافة فئات للجسم بطريقة تتبعية
      const addClassesToElement = (element: HTMLElement, classes: string[]) => {
        element.classList.add(...classes);
        addedClasses.current.push({element, classes});
      };
      
      addClassesToElement(document.body, [styles.scannerActive, 'scanner-mode']);
      
      // معالجة خاصة وموجهة للحوار الذي يعرض الماسح فقط
      document.querySelectorAll('[role="dialog"], .DialogOverlay, .DialogContent').forEach(dialog => {
        if (dialog instanceof HTMLElement) {
          addClassesToElement(dialog, ['scanner-dialog']);
          dialog.style.background = 'transparent';
          dialog.style.backgroundColor = 'transparent';
          dialog.style.setProperty('--background', 'transparent', 'important');
        }
      });
      
      // تهيئة الماسح الضوئي عن طريق MLKit
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const { supported } = await BarcodeScanner.isSupported();
          console.log('[useScannerUI] دعم الماسح الضوئي:', supported);
          
          if (supported) {
            const permResult = await BarcodeScanner.requestPermissions();
            console.log('[useScannerUI] نتيجة طلب الأذونات:', permResult);
            
            // تنشيط الكاميرا عن طريق الفلاش
            try {
              const torchResult = await BarcodeScanner.isTorchAvailable();
              if (torchResult.available) {
                await BarcodeScanner.enableTorch();
                setTimeout(async () => {
                  try {
                    await BarcodeScanner.disableTorch();
                  } catch (e) {}
                }, 300);
              }
            } catch (e) {
              console.log('[useScannerUI] غير قادر على تمكين الفلاش:', e);
            }
          }
        } catch (e) {
          console.warn('[useScannerUI] خطأ في تهيئة الماسح الضوئي:', e);
        }
      }
    } catch (error) {
      console.error("[useScannerUI] خطأ في إعداد خلفية الماسح:", error);
    }
  };

  const cleanupScannerBackground = async (force = false) => {
    console.log("[useScannerUI] تنظيف خلفية الماسح الضوئي");
    
    try {
      // 1. إزالة العناصر المضافة بشكل منظم
      const removeElementById = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
          element.remove();
          console.log(`[useScannerUI] تمت إزالة العنصر: ${id}`);
        }
      };
      
      // إزالة جميع العناصر التي تم تتبعها
      for (const element of addedElements.current) {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
          console.log(`[useScannerUI] تمت إزالة عنصر متتبع`);
        }
      }
      addedElements.current = [];
      
      // إزالة بالمعرفات كخطوة إضافية
      removeElementById(SCANNER_ROOT_ID);
      removeElementById(SCANNER_VIEWPORT_ID);
      removeElementById(SCANNER_PORTAL_ID);
      
      // 2. إزالة الفئات المضافة إلى العناصر
      for (const {element, classes} of addedClasses.current) {
        if (element) {
          element.classList.remove(...classes);
          console.log(`[useScannerUI] تمت إزالة الفئات من عنصر متتبع`);
        }
      }
      addedClasses.current = [];
      
      // 3. إزالة الفئات من عناصر معروفة (كإجراء إضافي)
      document.body.classList.remove(styles.scannerActive, 'scanner-mode');
      
      // 4. إزالة أنماط الحوارات
      document.querySelectorAll('.scanner-dialog').forEach(element => {
        if (element instanceof HTMLElement) {
          element.classList.remove('scanner-dialog');
          element.style.background = '';
          element.style.backgroundColor = '';
          element.style.removeProperty('--background');
        }
      });
      
      // 5. إيقاف المسح إذا كان MLKit متاحًا
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          await BarcodeScanner.disableTorch().catch(() => {});
          await BarcodeScanner.stopScan().catch(() => {});
        } catch (e) {
          console.warn("[useScannerUI] خطأ عند إيقاف مسح MLKit:", e);
        }
      }
      
      // 6. تأخير محاولة تنظيف إضافية لضمان التطبيق الكامل
      setTimeout(() => {
        // تحقق نهائي من إزالة أي فئات متبقية
        document.body.classList.remove(styles.scannerActive, 'scanner-mode');
        
        // التأكد من تنظيف أي أنماط شفافية متبقية
        document.querySelectorAll('[style*="transparent"]').forEach(el => {
          if (el instanceof HTMLElement && !el.className.includes('scanner-')) {
            el.style.background = '';
            el.style.backgroundColor = '';
            el.style.removeProperty('--background');
          }
        });
        
        // إرجاع خلفية للهيدر والفوتر بشكل قسري
        document.querySelectorAll('.app-header, .app-footer').forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.background = 'white';
            el.style.backgroundColor = 'white';
            el.style.visibility = 'visible';
            el.style.opacity = '1';
          }
        });
        
        console.log("[useScannerUI] اكتملت عملية التنظيف النهائية");
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
