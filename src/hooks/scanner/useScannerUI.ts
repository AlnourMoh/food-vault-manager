
import styles from '@/components/mobile/scanner/scanner.module.css';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useScannerUI = () => {
  const setupScannerBackground = async () => {
    console.log("[useScannerUI] إعداد خلفية الماسح الضوئي والكاميرا");
    
    try {
      // 1. تعيين الأنماط للخلفية المطلوبة للماسح
      document.body.classList.add(styles.scannerActive);
      document.body.classList.add(styles.transparentBackground);
      
      // 2. تطبيق الأنماط مباشرة على الجسم
      document.body.style.background = 'transparent';
      document.body.style.visibility = 'visible';
      
      // 3. إعداد خلفية شفافة للماسح MLKit
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
        // محاولة تعيين الوضع الشفاف
        await BarcodeScanner.enableTorch().catch(() => {});
        
        // تعيين الواجهة المناسبة للماسح
        await BarcodeScanner.setUIOptions({
          controlsVisibility: 'hidden'
        }).catch((e) => console.log("[useScannerUI] لا يمكن تعيين خيارات الواجهة:", e));
      }
      
      // 4. إذا كان ماسح BarcodeScanner التقليدي متاحًا أيضًا
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
        await BarcodeScanner.hideBackground();
      }
      
    } catch (error) {
      console.error("[useScannerUI] خطأ في إعداد خلفية الماسح:", error);
    }
  };

  const cleanupScannerBackground = async () => {
    console.log("[useScannerUI] تنظيف خلفية الماسح الضوئي");
    
    try {
      // 1. إزالة جميع الأنماط التي تمت إضافتها
      document.body.classList.remove(styles.scannerActive);
      document.body.classList.remove(styles.transparentBackground);
      
      // 2. إعادة ضبط النمط المباشر
      document.body.style.background = '';
      document.body.style.visibility = '';
      
      // 3. تنظيف MLKit BarcodeScanner إذا كان مستخدمًا
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
          await BarcodeScanner.disableTorch().catch(() => {});
        } catch (e) {
          console.warn("[useScannerUI] خطأ عند تنظيف MLKit:", e);
        }
      }
      
      // 4. تنظيف BarcodeScanner التقليدي إذا كان مستخدمًا
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        try {
          const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
          await BarcodeScanner.showBackground().catch(() => {});
          await BarcodeScanner.stopScan().catch(() => {});
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
