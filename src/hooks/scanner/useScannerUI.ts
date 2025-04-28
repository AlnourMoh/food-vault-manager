
import styles from '@/components/mobile/scanner/scanner.module.css';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useScannerUI = () => {
  const setupScannerBackground = async () => {
    console.log("[useScannerUI] إعداد خلفية الماسح الضوئي والكاميرا");
    
    try {
      // 1. تطبيق الأنماط على العناصر في الصفحة
      document.querySelector('body')?.classList.add(styles.scannerActive);
      document.querySelector('body')?.classList.add(styles.transparentBackground);
      
      // 2. تطبيق أنماط CSS مباشرة لضمان شفافية الخلفية
      document.body.style.background = 'transparent';
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
      
      // إزالة أي عناصر تتداخل مع عرض الكاميرا
      const appRoot = document.getElementById('root');
      if (appRoot) {
        appRoot.style.background = 'transparent';
      }
      
      // 3. تفعيل وضع الشفافية في MLKit
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log("[useScannerUI] تفعيل وضع الشفافية لـ MLKit");
        // مسح أي خلفيات قد تمنع عرض الكاميرا
        document.documentElement.style.background = 'transparent';
        document.body.style.background = 'transparent';
      }
      
      // 4. تهيئة BarcodeScanner التقليدي إذا كان متاحًا
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
        try {
          console.log("[useScannerUI] إخفاء الخلفية للماسح التقليدي");
          await BarcodeScanner.hideBackground();
        } catch (error) {
          console.warn("[useScannerUI] خطأ في إخفاء الخلفية:", error);
        }
      }
      
    } catch (error) {
      console.error("[useScannerUI] خطأ في إعداد خلفية الماسح:", error);
    }
  };

  const cleanupScannerBackground = async () => {
    console.log("[useScannerUI] تنظيف خلفية الماسح الضوئي");
    
    try {
      // 1. إزالة جميع الأنماط التي تمت إضافتها
      document.querySelector('body')?.classList.remove(styles.scannerActive);
      document.querySelector('body')?.classList.remove(styles.transparentBackground);
      
      // 2. إعادة ضبط النمط المباشر
      document.body.style.background = '';
      document.body.style.visibility = '';
      document.body.style.opacity = '';
      
      // إعادة ضبط نمط العنصر الجذر
      const appRoot = document.getElementById('root');
      if (appRoot) {
        appRoot.style.background = '';
      }
      
      // إعادة ضبط نمط عنصر html
      document.documentElement.style.background = '';
      
      // 3. تنظيف MLKit BarcodeScanner إذا كان مستخدمًا
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
          await BarcodeScanner.stopScanning();
        } catch (e) {
          console.warn("[useScannerUI] خطأ عند إيقاف مسح MLKit:", e);
        }
      }
      
      // 4. تنظيف BarcodeScanner التقليدي إذا كان مستخدمًا
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
