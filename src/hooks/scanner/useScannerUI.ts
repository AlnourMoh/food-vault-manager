
import styles from '@/components/mobile/scanner/scanner.module.css';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useScannerUI = () => {
  const setupScannerBackground = async () => {
    console.log("[useScannerUI] إعداد خلفية الماسح الضوئي والكاميرا");
    
    try {
      // إضافة الفئات الضرورية إلى body
      document.body.classList.add(styles.scannerActive);
      document.body.classList.add(styles.transparentBackground);
      
      // تطبيق أنماط مباشرة لضمان الشفافية
      document.documentElement.style.background = 'transparent';
      document.documentElement.style.backgroundColor = 'transparent';
      document.body.style.background = 'transparent';
      document.body.style.backgroundColor = 'transparent';
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
      
      // إزالة أي عناصر قد تتداخل
      const appRoot = document.getElementById('root');
      if (appRoot) {
        appRoot.style.background = 'transparent';
        appRoot.style.backgroundColor = 'transparent';
      }
      
      // تأكيد على الشفافية لجميع العناصر الرئيسية
      const mainElements = document.querySelectorAll('main, div.main, .main-content');
      mainElements.forEach(elem => {
        if (elem instanceof HTMLElement) {
          elem.style.background = 'transparent';
          elem.style.backgroundColor = 'transparent';
        }
      });
      
      // تطبيق الأنماط على الحاويات التي قد تتداخل مع رؤية الكاميرا
      const containers = document.querySelectorAll('.container, .content');
      containers.forEach(container => {
        if (container instanceof HTMLElement) {
          container.style.background = 'transparent';
          container.style.backgroundColor = 'transparent';
        }
      });
    } catch (error) {
      console.error("[useScannerUI] خطأ في إعداد خلفية الماسح:", error);
    }
  };

  const cleanupScannerBackground = async () => {
    console.log("[useScannerUI] تنظيف خلفية الماسح الضوئي");
    
    try {
      // إزالة الفئات المضافة
      document.body.classList.remove(styles.scannerActive);
      document.body.classList.remove(styles.transparentBackground);
      
      // إعادة ضبط الأنماط المباشرة
      document.documentElement.style.background = '';
      document.documentElement.style.backgroundColor = '';
      document.body.style.background = '';
      document.body.style.backgroundColor = '';
      document.body.style.visibility = '';
      document.body.style.opacity = '';
      
      // إعادة ضبط نمط العنصر الجذر
      const appRoot = document.getElementById('root');
      if (appRoot) {
        appRoot.style.background = '';
        appRoot.style.backgroundColor = '';
      }
      
      // إعادة ضبط الأنماط لجميع العناصر الرئيسية
      const mainElements = document.querySelectorAll('main, div.main, .main-content');
      mainElements.forEach(elem => {
        if (elem instanceof HTMLElement) {
          elem.style.background = '';
          elem.style.backgroundColor = '';
        }
      });
      
      // إعادة ضبط الأنماط للحاويات
      const containers = document.querySelectorAll('.container, .content');
      containers.forEach(container => {
        if (container instanceof HTMLElement) {
          container.style.background = '';
          container.style.backgroundColor = '';
        }
      });
      
      // إيقاف المسح إذا كان MLKit متاحًا
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
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
