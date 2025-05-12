
import { useEffect } from 'react';

interface UseDialogEffectsProps {
  open: boolean;
  setShowScanner: (show: boolean) => void;
  setHasScannerError: (hasError: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

/**
 * Hook to manage dialog visibility effects and DOM manipulations
 */
export const useDialogEffects = ({
  open,
  setShowScanner,
  setHasScannerError,
  setIsProcessing
}: UseDialogEffectsProps) => {
  useEffect(() => {
    if (open) {
      console.log('ScanProductDialog: تم فتح الحوار، جاري التأكد من الأذونات...');
      
      // تحسين آلية إدارة الحوار - حصر الشفافية داخل الحوار فقط
      document.querySelectorAll('[role="dialog"]').forEach(element => {
        if (element instanceof HTMLElement) {
          element.classList.add('scanner-dialog-container');
          // التأكد من عدم تأثير الماسح على الهيدر والفوتر
          element.querySelectorAll('header, footer, nav').forEach(el => {
            if (el instanceof HTMLElement) {
              el.classList.add('app-header');
            }
          });
        }
      });
      
      // تأخير عرض الماسح لضمان تهيئة الحوار أولاً
      setTimeout(() => {
        setShowScanner(true);
      }, 300);
      
      // إعادة تعيين حالة الماسح
      setHasScannerError(false);
      setIsProcessing(false);
    } else {
      console.log('ScanProductDialog: تم إغلاق الحوار');
      setShowScanner(false);
      
      // إزالة الفئات المضافة للحوار
      document.querySelectorAll('.scanner-dialog-container').forEach(element => {
        if (element instanceof HTMLElement) {
          element.classList.remove('scanner-dialog-container');
        }
      });
      
      // تأكيد إرجاع أنماط الهيدر والفوتر
      setTimeout(() => {
        document.querySelectorAll('header, .app-header').forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.background = 'white';
            el.style.backgroundColor = 'white';
            el.style.visibility = 'visible';
            el.style.opacity = '1';
            el.style.zIndex = '1001';
          }
        });
      }, 200);
    }
    
    // تنظيف عند إزالة المكون
    return () => {
      console.log('ScanProductDialog: تنظيف الموارد');
      
      // إزالة الفئات المضافة للحوارات
      document.querySelectorAll('.scanner-dialog-container').forEach(element => {
        if (element instanceof HTMLElement) {
          element.classList.remove('scanner-dialog-container');
        }
      });
      
      // تأكيد آخر على إرجاع أنماط الهيدر والفوتر
      document.querySelectorAll('header, .app-header').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.background = 'white';
          el.style.backgroundColor = 'white';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        }
      });
    };
  }, [open, setShowScanner, setHasScannerError, setIsProcessing]);
};
