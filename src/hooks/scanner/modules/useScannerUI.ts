
import { useState, useCallback } from 'react';

/**
 * هوك لإدارة واجهة المستخدم للماسح
 */
export const useScannerUI = () => {
  const [isManualEntry, setIsManualEntry] = useState(false);
  
  /**
   * تنفيذ إعداد خلفية الماسح
   */
  const setupScannerBackground = useCallback(async () => {
    try {
      // إخفاء عناصر الواجهة أثناء المسح
      document.querySelectorAll('header, footer, nav').forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.opacity = '0';
          element.style.visibility = 'hidden';
          element.style.pointerEvents = 'none';
        }
      });
      
      // إضافة فئة للتحكم في المظهر العام
      document.body.classList.add('scanner-active');
      
      return true;
    } catch (error) {
      console.error('[useScannerUI] خطأ في إعداد خلفية الماسح:', error);
      return false;
    }
  }, []);

  /**
   * استعادة واجهة المستخدم بعد المسح
   */
  const restoreUIAfterScanning = useCallback(async () => {
    try {
      // استعادة عناصر الواجهة بشكل تدريجي
      setTimeout(() => {
        document.querySelectorAll('header, footer, nav').forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.opacity = '';
            el.style.visibility = '';
            el.style.pointerEvents = '';
          }
        });
      }, 200);
      
      // إزالة فئة التحكم في المظهر العام
      document.body.classList.remove('scanner-active');
      
      return true;
    } catch (error) {
      console.error('[useScannerUI] خطأ في استعادة واجهة المستخدم:', error);
      return false;
    }
  }, []);

  /**
   * التبديل إلى الإدخال اليدوي
   */
  const handleManualEntry = useCallback(() => {
    setIsManualEntry(true);
  }, []);

  /**
   * إلغاء الإدخال اليدوي
   */
  const handleManualCancel = useCallback(() => {
    setIsManualEntry(false);
  }, []);

  return {
    isManualEntry,
    setIsManualEntry,
    setupScannerBackground,
    restoreUIAfterScanning,
    handleManualEntry,
    handleManualCancel
  };
};
