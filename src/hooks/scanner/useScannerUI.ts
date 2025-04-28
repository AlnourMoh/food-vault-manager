
import styles from '@/components/mobile/scanner/scanner.module.css';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useScannerUI = () => {
  // ضبط الترقيم التعريفي للعناصر المضافة لتسهيل إزالتها
  const SCANNER_VIEWPORT_ID = 'scanner-viewport-element';
  const SCANNER_PORTAL_ID = 'scanner-portal-container';
  
  const setupScannerBackground = async () => {
    console.log("[useScannerUI] إعداد خلفية الماسح الضوئي والكاميرا");
    
    try {
      // عناصر محددة لتطبيق الشفافية عليها فقط - نطاق محدود
      const scannerViewportElement = document.createElement('div');
      scannerViewportElement.id = SCANNER_VIEWPORT_ID;
      scannerViewportElement.className = styles.cameraViewport;
      document.body.appendChild(scannerViewportElement);
      
      // إنشاء بوابة للماسح الضوئي لعزل التأثيرات
      const scannerPortal = document.createElement('div');
      scannerPortal.id = SCANNER_PORTAL_ID;
      scannerPortal.className = styles.scannerPortal;
      document.body.appendChild(scannerPortal);
      
      // إضافة فئة محددة للجسم - تجنب التأثير على المستند بأكمله
      document.body.classList.add(styles.scannerActive, 'scanner-mode');
      
      // معالجة خاصة وموجهة للحوار الذي يعرض الماسح فقط
      const dialogs = document.querySelectorAll('[role="dialog"], .DialogOverlay, .DialogContent');
      dialogs.forEach(dialog => {
        if (dialog instanceof HTMLElement) {
          dialog.style.background = 'transparent';
          dialog.style.backgroundColor = 'transparent';
          dialog.style.setProperty('--background', 'transparent', 'important');
          dialog.classList.add('scanner-dialog');
        }
      });
      
      // تهيئة عناصر الماسح الضوئي إذا كان MLKit متاحًا
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          // تهيئة الماسح الضوئي مسبقًا
          const { supported } = await BarcodeScanner.isSupported();
          console.log('[useScannerUI] دعم الماسح الضوئي:', supported);
          
          // تفعيل الأذونات إذا كان مدعومًا
          if (supported) {
            const permResult = await BarcodeScanner.requestPermissions();
            console.log('[useScannerUI] نتيجة طلب الأذونات:', permResult);
            
            // اختبار وتهيئة الفلاش لتنشيط الكاميرا
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

  const cleanupScannerBackground = async () => {
    console.log("[useScannerUI] تنظيف خلفية الماسح الضوئي");
    
    try {
      // إزالة العناصر المضافة بشكل صريح باستخدام المعرفات
      const removeElementById = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
          element.remove();
          console.log(`[useScannerUI] تمت إزالة العنصر: ${id}`);
          return true;
        }
        return false;
      };
      
      removeElementById(SCANNER_VIEWPORT_ID);
      removeElementById(SCANNER_PORTAL_ID);
      
      // إزالة الفئات المضافة للجسم
      document.body.classList.remove(styles.scannerActive, 'scanner-mode');
      
      // إعادة تعيين أنماط الحوارات إذا كانت موجودة
      document.querySelectorAll('.scanner-dialog').forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.background = '';
          element.style.backgroundColor = '';
          element.style.removeProperty('--background');
          element.classList.remove('scanner-dialog');
        }
      });
      
      // إيقاف المسح إذا كان MLKit متاحًا
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          await BarcodeScanner.disableTorch().catch(() => {});
          await BarcodeScanner.stopScan().catch(() => {});
        } catch (e) {
          console.warn("[useScannerUI] خطأ عند إيقاف مسح MLKit:", e);
        }
      }
      
      // محاولة ثانية للتنظيف بعد فترة قصيرة للتأكد من التطبيق الكامل
      setTimeout(() => {
        // تحقق نهائي وإزالة أي فئات متبقية
        document.body.classList.remove(styles.scannerActive, 'scanner-mode');
        
        // لتأكيد التنظيف: طباعة حالة الفئات للتحقق
        console.log("[useScannerUI] حالة الفئات بعد التنظيف:", {
          hasActiveScannerClass: document.body.classList.contains(styles.scannerActive),
          hasScannerModeClass: document.body.classList.contains('scanner-mode')
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
