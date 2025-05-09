
import { useCallback } from 'react';
import { Toast } from '@capacitor/toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';

export const useScannerUI = () => {
  // إعداد الخلفية للماسح
  const setupScannerBackground = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useScannerUI] إعداد خلفية الماسح...');
      
      // محاولة إخفاء خلفية التطبيق على المنصات المدعومة
      if (Capacitor.isNativePlatform()) {
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          try {
            // استخدام MLKit BarcodeScanner لإخفاء خلفية التطبيق
            console.log('[useScannerUI] إخفاء خلفية التطبيق باستخدام MLKit...');
            
            // لن نحتاج لهذا عندما نستخدم طريقة الفتح المباشر
            // await BarcodeScanner.hideBackground();
            
            // تطبيق أنماط CSS لإخفاء العناصر الأخرى
            document.documentElement.style.setProperty('--app-bg-opacity', '0');
            
            // إخفاء عناصر واجهة المستخدم الأخرى
            const elementsToHide = document.querySelectorAll('header, footer, nav');
            elementsToHide.forEach((el) => {
              if (el instanceof HTMLElement) {
                el.classList.add('app-header');
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
                el.style.background = 'transparent';
              }
            });
            
            return true;
          } catch (e) {
            console.error('[useScannerUI] خطأ في إخفاء خلفية MLKit:', e);
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error('[useScannerUI] خطأ في إعداد خلفية الماسح:', error);
      return false;
    }
  }, []);
  
  // استعادة واجهة المستخدم بعد المسح
  const restoreUIAfterScanning = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useScannerUI] استعادة واجهة المستخدم بعد المسح...');
      
      // استعادة العناصر المخفية
      document.documentElement.style.setProperty('--app-bg-opacity', '1');
      
      // إظهار عناصر واجهة المستخدم
      const elementsToShow = document.querySelectorAll('.app-header');
      elementsToShow.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.background = el.dataset.originalBg || 'white';
          el.classList.remove('app-header');
        }
      });
      
      // إظهار الخلفية باستخدام MLKit إذا كانت متاحة
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          // لم نعد نحتاج لهذا لأننا نستخدم طريقة أخرى للمسح
          // await BarcodeScanner.showBackground();
        } catch (e) {
          console.error('[useScannerUI] خطأ في إظهار خلفية MLKit:', e);
        }
      }
      
      return true;
    } catch (error) {
      console.error('[useScannerUI] خطأ في استعادة واجهة المستخدم:', error);
      return false;
    }
  }, []);
  
  // تنظيف الماسح ومعالجة الحالات الخاصة
  const cleanup = useCallback(async (): Promise<void> => {
    try {
      console.log('[useScannerUI] تنظيف الماسح...');
      
      // استعادة واجهة المستخدم
      await restoreUIAfterScanning();
      
      // إيقاف البث المباشر من الكاميرا
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          await BarcodeScanner.stopScan();
        } catch (e) {
          console.error('[useScannerUI] خطأ في إيقاف المسح عند التنظيف:', e);
        }
      }
      
    } catch (error) {
      console.error('[useScannerUI] خطأ في تنظيف الماسح:', error);
    }
  }, [restoreUIAfterScanning]);
  
  return {
    setupScannerBackground,
    restoreUIAfterScanning,
    cleanup
  };
};
