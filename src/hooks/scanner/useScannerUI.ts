
import styles from '@/components/mobile/scanner/scanner.module.css';

export const useScannerUI = () => {
  const setupScannerBackground = () => {
    // استخدام نهج أبسط وأكثر موثوقية لتعيين الخلفية
    console.log("[useScannerUI] تهيئة خلفية الماسح الضوئي");
    
    try {
      document.body.classList.add(styles.scannerActive);
      document.body.classList.add(styles.transparentBackground);
      
      // تطبيق النمط مباشرة للتأكد من العمل على جميع الأجهزة
      document.body.style.background = 'transparent';
      document.body.style.visibility = 'visible';
    } catch (error) {
      console.error("[useScannerUI] خطأ في إعداد خلفية الماسح:", error);
    }
  };

  const cleanupScannerBackground = () => {
    console.log("[useScannerUI] تنظيف خلفية الماسح الضوئي");
    
    try {
      // إزالة جميع الأنماط التي تمت إضافتها
      document.body.classList.remove(styles.scannerActive);
      document.body.classList.remove(styles.transparentBackground);
      
      // إعادة ضبط النمط المباشر
      document.body.style.background = '';
      document.body.style.visibility = '';
    } catch (error) {
      console.error("[useScannerUI] خطأ في تنظيف خلفية الماسح:", error);
    }
  };

  return {
    setupScannerBackground,
    cleanupScannerBackground
  };
};
