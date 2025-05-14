
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
      console.log('[useScannerUI] إعداد خلفية الماسح...');
      
      // إخفاء عناصر الواجهة أثناء المسح
      document.querySelectorAll('header:not(.scanner-header), footer:not(.scanner-footer), nav:not(.scanner-nav)')
        .forEach(element => {
          if (element instanceof HTMLElement) {
            // حفظ الحالة الأصلية إذا لم تكن محفوظة بالفعل
            if (!element.dataset.originalVisibility) {
              element.dataset.originalVisibility = element.style.visibility || 'visible';
              element.dataset.originalOpacity = element.style.opacity || '1';
              element.dataset.originalBackground = element.style.background || '';
            }
            
            // تطبيق أنماط الإخفاء
            element.style.opacity = '0';
            element.style.visibility = 'hidden';
            element.style.pointerEvents = 'none';
          }
        });
      
      // إضافة فئة للتحكم في المظهر العام
      document.body.classList.add('scanner-active');
      
      // تعيين متغيرات CSS للتحكم في المظهر
      document.documentElement.style.setProperty('--app-bg-opacity', '0');
      
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
      console.log('[useScannerUI] استعادة واجهة المستخدم بعد المسح...');
      
      // استعادة عناصر الواجهة بشكل تدريجي
      document.querySelectorAll('header, footer, nav').forEach(el => {
        if (el instanceof HTMLElement) {
          // استعادة القيم الأصلية إذا كانت محفوظة
          if (el.dataset.originalVisibility) {
            el.style.visibility = el.dataset.originalVisibility;
            el.style.opacity = el.dataset.originalOpacity || '1';
            el.style.background = el.dataset.originalBackground || '';
            el.style.pointerEvents = '';
            
            // مسح البيانات المخزنة
            delete el.dataset.originalVisibility;
            delete el.dataset.originalOpacity;
            delete el.dataset.originalBackground;
          } else {
            // استعادة القيم الافتراضية إذا لم تكن هناك قيم محفوظة
            el.style.visibility = 'visible';
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
          }
        }
      });
      
      // إزالة فئة التحكم في المظهر العام
      document.body.classList.remove('scanner-active');
      
      // إعادة تعيين متغيرات CSS
      document.documentElement.style.setProperty('--app-bg-opacity', '1');
      
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
