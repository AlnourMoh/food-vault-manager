
import { useState, useEffect } from 'react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';

export interface DialogStateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const useDialogState = ({ open, onOpenChange }: DialogStateProps) => {
  const [showScanner, setShowScanner] = useState(false);

  // تحسين آلية إدارة الحوار - حصر الشفافية داخل الحوار فقط
  useEffect(() => {
    if (open) {
      console.log('ScanProductDialog: تم فتح الحوار، جاري التأكد من الأذونات...');
      
      // التحقق من إذن الكاميرا قبل عرض الماسح
      const checkPermission = async () => {
        try {
          const hasPermission = await scannerPermissionService.checkPermission();
          
          if (!hasPermission) {
            console.log('ScanProductDialog: لا يوجد إذن للكاميرا، سنعرض شاشة طلب الإذن');
          }
          
          // تأخير عرض الماسح لضمان تهيئة الحوار أولاً
          setTimeout(() => {
            setShowScanner(true);
          }, 300);
        } catch (error) {
          console.error('ScanProductDialog: خطأ في التحقق من إذن الكاميرا:', error);
          // في حالة حدوث خطأ نعرض الماسح على أي حال
          setTimeout(() => {
            setShowScanner(true);
          }, 300);
        }
      };
      
      // تطبيق فئة "scanner-dialog-container" على الحوار للإشارة إلى أن الماسح نشط
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
      
      // التحقق من إذن الكاميرا
      checkPermission();
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
  }, [open]);

  return {
    showScanner,
    setShowScanner
  };
};
