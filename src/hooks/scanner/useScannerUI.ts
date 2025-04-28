
import styles from '@/components/mobile/scanner/scanner.module.css';

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
      
      // إزالة أي عناصر قد تتداخل
      const appRoot = document.getElementById('root');
      if (appRoot) {
        appRoot.style.background = 'transparent';
        appRoot.style.backgroundColor = 'transparent';
        appRoot.style.setProperty('--background', 'transparent', 'important');
      }
      
      // تأكيد على الشفافية لجميع العناصر الرئيسية
      const allElements = document.querySelectorAll('div, main, section, nav, header, footer, ion-content, .main, .main-content');
      allElements.forEach(elem => {
        if (elem instanceof HTMLElement) {
          elem.style.setProperty('--background', 'transparent', 'important');
          elem.style.background = 'transparent';
          elem.style.backgroundColor = 'transparent';
          elem.style.opacity = '1';
        }
      });
      
      // تطبيق الأنماط الضرورية لعرض الكاميرا
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        // إذا لم يكن موجودًا، نقوم بإنشائه
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no');
        document.head.appendChild(meta);
      } else {
        // تحديث العنصر الموجود
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no');
      }
      
      // التأكد من أن الحاوي الرئيسي عريض بما فيه الكفاية
      const scannerContainers = document.querySelectorAll(`.${styles.scannerContainer}`);
      scannerContainers.forEach(container => {
        if (container instanceof HTMLElement) {
          container.style.width = '100vw';
          container.style.height = '100vh';
          container.style.position = 'fixed';
          container.style.top = '0';
          container.style.left = '0';
          container.style.zIndex = '9999';
          container.style.background = 'transparent';
        }
      });

      // إنشاء عنصر ملء يساعد في تهيئة الكاميرا
      const fillElement = document.querySelector('.camera-fill-element');
      if (!fillElement) {
        const fill = document.createElement('div');
        fill.className = 'camera-fill-element';
        fill.style.position = 'fixed';
        fill.style.top = '0';
        fill.style.left = '0';
        fill.style.width = '100vw';
        fill.style.height = '100vh';
        fill.style.zIndex = '-1';
        fill.style.background = 'transparent';
        fill.style.pointerEvents = 'none';
        document.body.appendChild(fill);
      }
    } catch (error) {
      console.error("[useScannerUI] خطأ في إعداد خلفية الماسح:", error);
    }
  };

  const cleanupScannerBackground = async () => {
    console.log("[useScannerUI] تنظيف خلفية الماسح الضوئي");
    
    try {
      // إزالة العناصر الإضافية
      const fillElement = document.querySelector('.camera-fill-element');
      if (fillElement) {
        fillElement.remove();
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
      
      // إعادة ضبط الأنماط لجميع العناصر
      const allElements = document.querySelectorAll('div, main, section, nav, header, footer, ion-content, .main, .main-content');
      allElements.forEach(elem => {
        if (elem instanceof HTMLElement) {
          elem.style.removeProperty('--background');
          elem.style.background = '';
          elem.style.backgroundColor = '';
          elem.style.opacity = '';
        }
      });
      
      // إيقاف المسح إذا كان MLKit متاحًا
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
          await BarcodeScanner.disableTorch();
          await BarcodeScanner.stopScan();
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
