
import { useCallback } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

/**
 * Hook لإدارة واجهة المستخدم للماسح الضوئي - تم تحسينه للاستجابة السريعة
 */
export const useScannerUI = () => {
  /**
   * تهيئة خلفية الماسح الضوئي بشكل فوري
   */
  const setupScannerBackground = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useScannerUI] تهيئة خلفية الماسح...');
      
      // تحديد العناصر التي نحتاج إلى إخفائها على الفور
      document.querySelectorAll('header, .app-header, footer, nav, .app-footer').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
        }
      });
      
      // تعيين خلفية الجسم إلى شفافة لإظهار الكاميرا فورًا
      document.body.classList.add('scanner-active');
      
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          // تهيئة الكاميرا بشكل متوازي لتسريع العملية
          if (typeof BarcodeScanner.prepare === 'function') {
            BarcodeScanner.prepare().catch(error => {
              console.error('[useScannerUI] خطأ في تفعيل الكاميرا:', error);
            });
          }
        } catch (error) {
          console.error('[useScannerUI] خطأ في تفعيل الكاميرا:', error);
          // نستمر حتى لو فشل هذا الجزء
        }
      }
      
      // إضافة حدود للعناصر المهمة التي نريد إظهارها فوق الكاميرا
      document.querySelectorAll('.scanner-frame, .scanner-overlay, .scanner-controls').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.position = 'relative';
          el.style.zIndex = '999';
        }
      });
      
      return true;
    } catch (error) {
      console.error('[useScannerUI] خطأ في إعداد خلفية الماسح:', error);
      return false;
    }
  }, []);
  
  /**
   * استعادة واجهة المستخدم بعد المسح
   */
  const restoreUIAfterScanning = useCallback(async (): Promise<void> => {
    try {
      console.log('[useScannerUI] استعادة واجهة المستخدم بعد المسح...');
      
      // إزالة أي قيود على العناصر
      document.body.classList.remove('scanner-active');
      
      // استعادة العناصر المخفية
      document.querySelectorAll('header, .app-header, footer, nav, .app-footer').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.opacity = '1';
          el.style.visibility = 'visible';
        }
      });
      
      // إزالة القيود من العناصر التي أضفناها
      document.querySelectorAll('.scanner-frame, .scanner-overlay, .scanner-controls').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.position = '';
          el.style.zIndex = '';
        }
      });
      
      // إيقاف الكاميرا إذا كانت نشطة
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          if (typeof BarcodeScanner.stopScan === 'function') {
            await BarcodeScanner.stopScan().catch(() => {});
          }
        } catch (error) {
          console.error('[useScannerUI] خطأ في إيقاف الكاميرا:', error);
        }
      }
    } catch (error) {
      console.error('[useScannerUI] خطأ في استعادة واجهة المستخدم:', error);
    }
  }, []);
  
  /**
   * تنظيف أي تغييرات في واجهة المستخدم
   */
  const cleanup = useCallback((): void => {
    try {
      console.log('[useScannerUI] تنظيف واجهة المستخدم...');
      
      // إزالة فئة حالة الماسح
      document.body.classList.remove('scanner-active');
      
      // استعادة جميع العناصر المخفية
      document.querySelectorAll('header, .app-header, footer, nav, .app-footer').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          el.style.background = '';
          el.style.backgroundColor = '';
        }
      });
    } catch (error) {
      console.error('[useScannerUI] خطأ في تنظيف واجهة المستخدم:', error);
    }
  }, []);

  // إضافة cleanupScannerBackground كاسم بديل لـ restoreUIAfterScanning للتوافق مع الكود القديم
  const cleanupScannerBackground = restoreUIAfterScanning;
  
  return {
    setupScannerBackground,
    restoreUIAfterScanning,
    cleanupScannerBackground,
    cleanup
  };
};
