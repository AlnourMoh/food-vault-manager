
import styles from '@/components/mobile/scanner/scanner.module.css';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useScannerUI = () => {
  const setupScannerBackground = async () => {
    console.log("[useScannerUI] إعداد خلفية الماسح الضوئي والكاميرا");
    
    try {
      // تطبيق أنماط شفافية فائقة
      document.documentElement.classList.add('transparent-bg');
      document.body.classList.add('transparent-bg');
      document.documentElement.style.setProperty('--ion-background-color', 'transparent', 'important');
      document.body.style.setProperty('--ion-background-color', 'transparent', 'important');
      
      // إضافة الفئات الضرورية إلى body
      document.body.classList.add(styles.scannerActive);
      document.body.classList.add(styles.transparentBackground);
      
      // تطبيق أنماط مباشرة لضمان الشفافية التامة
      document.documentElement.style.background = 'transparent';
      document.documentElement.style.backgroundColor = 'transparent';
      document.documentElement.style.setProperty('--background', 'transparent', 'important');
      document.body.style.background = 'transparent';
      document.body.style.backgroundColor = 'transparent';
      document.body.style.setProperty('--background', 'transparent', 'important');
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
      
      // إزالة أي عناصر قد تتداخل مع عرض الكاميرا
      const appRoot = document.getElementById('root');
      if (appRoot) {
        appRoot.style.background = 'transparent';
        appRoot.style.backgroundColor = 'transparent';
        appRoot.style.setProperty('--background', 'transparent', 'important');
      }
      
      // معالجة خاصة للحوار الذي يعرض الماسح
      const dialogs = document.querySelectorAll('[role="dialog"], .DialogOverlay, .DialogContent');
      dialogs.forEach(dialog => {
        if (dialog instanceof HTMLElement) {
          dialog.style.background = 'transparent';
          dialog.style.backgroundColor = 'transparent';
          dialog.style.boxShadow = 'none';
          dialog.style.setProperty('--background', 'transparent', 'important');
        }
      });
      
      // التأكد من تطبيق الأنماط على أي عنصر قد يمنع الشفافية
      const mainElements = document.querySelectorAll('main, section, div.container, div[class*="content"]');
      mainElements.forEach(elem => {
        if (elem instanceof HTMLElement) {
          elem.style.background = 'transparent';
          elem.style.backgroundColor = 'transparent';
          elem.style.setProperty('--background', 'transparent', 'important');
        }
      });
      
      // تطبيق أنماط خاصة لعناصر واجهة المستخدم
      const modals = document.querySelectorAll('.modal, .dialog, .popup, .overlay');
      modals.forEach(modal => {
        if (modal instanceof HTMLElement) {
          modal.style.background = 'transparent';
          modal.style.backgroundColor = 'transparent';
          modal.style.boxShadow = 'none';
          modal.style.setProperty('--background', 'transparent', 'important');
        }
      });
      
      // إضافة عنصر لتحسين عرض الكاميرا
      const scannerViewportElement = document.createElement('div');
      scannerViewportElement.className = 'scanner-viewport-element ' + styles.cameraViewport;
      scannerViewportElement.style.position = 'fixed';
      scannerViewportElement.style.top = '0';
      scannerViewportElement.style.left = '0';
      scannerViewportElement.style.width = '100vw';
      scannerViewportElement.style.height = '100vh';
      scannerViewportElement.style.zIndex = '1';
      scannerViewportElement.style.background = 'transparent';
      document.body.appendChild(scannerViewportElement);
      
      // تهيئة عناصر الماسح الضوئي
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          // تهيئة الماسح الضوئي مسبقًا
          const { supported } = await BarcodeScanner.isSupported();
          console.log('[useScannerUI] دعم الماسح الضوئي:', supported);
          
          // تفعيل الأذونات
          const permResult = await BarcodeScanner.requestPermissions();
          console.log('[useScannerUI] نتيجة طلب الأذونات:', permResult);
          
          // اختبار وتهيئة الفلاش
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
      // إزالة العناصر المضافة
      const scannerViewportElement = document.querySelector('.scanner-viewport-element');
      if (scannerViewportElement) {
        scannerViewportElement.remove();
      }
      
      // إزالة الفئات المضافة
      document.documentElement.classList.remove('transparent-bg');
      document.body.classList.remove('transparent-bg');
      document.body.classList.remove(styles.scannerActive);
      document.body.classList.remove(styles.transparentBackground);
      
      // إعادة ضبط الأنماط المباشرة
      document.documentElement.style.removeProperty('--ion-background-color');
      document.body.style.removeProperty('--ion-background-color');
      document.documentElement.style.background = '';
      document.documentElement.style.backgroundColor = '';
      document.documentElement.style.removeProperty('--background');
      document.body.style.background = '';
      document.body.style.backgroundColor = '';
      document.body.style.removeProperty('--background');
      document.body.style.visibility = '';
      document.body.style.opacity = '';
      
      // إعادة ضبط نمط العنصر الجذر
      const appRoot = document.getElementById('root');
      if (appRoot) {
        appRoot.style.background = '';
        appRoot.style.backgroundColor = '';
        appRoot.style.removeProperty('--background');
      }
      
      // إعادة ضبط أي عناصر تمت معالجتها
      const allElements = [
        ...Array.from(document.querySelectorAll('main, section, div.container, div[class*="content"]')),
        ...Array.from(document.querySelectorAll('.modal, .dialog, .popup, .overlay')),
        ...Array.from(document.querySelectorAll('[role="dialog"], .DialogOverlay, .DialogContent'))
      ];
      
      allElements.forEach(elem => {
        if (elem instanceof HTMLElement) {
          elem.style.background = '';
          elem.style.backgroundColor = '';
          elem.style.boxShadow = '';
          elem.style.removeProperty('--background');
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
      
      // إيقاف BarcodeScanner التقليدي إذا كان متاحًا
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        try {
          const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
          await BarcodeScanner.showBackground();
          await BarcodeScanner.stopScan();
        } catch (e) {
          console.warn("[useScannerUI] خطأ عند تنظيف الماسح التقليدي:", e);
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
