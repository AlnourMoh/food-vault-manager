
import { useRef } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { scannerUIService } from '@/services/scanner/ScannerUIService';

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
      
      // استخدام الخدمة الجديدة لإعداد الواجهة
      scannerUIService.setupUIForScanning();
    } catch (error) {
      console.error("[useScannerUI] خطأ في إعداد خلفية الماسح:", error);
    }
  };

  const cleanupScannerBackground = async (force = false) => {
    console.log("[useScannerUI] تنظيف خلفية الماسح");
    
    try {
      // استخدام الخدمة الجديدة لاستعادة الواجهة
      scannerUIService.restoreUIAfterScanning();
      
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
