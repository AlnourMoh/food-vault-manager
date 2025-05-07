
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseScanProductHandlerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void;
  toast: any;
}

export const useScanProductHandler = ({ 
  open, 
  onOpenChange, 
  onProductAdded,
  toast
}: UseScanProductHandlerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasScannerError, setHasScannerError] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // تحسين آلية إدارة الحوار - حصر الشفافية داخل الحوار فقط
  useEffect(() => {
    if (open) {
      console.log('ScanProductDialog: تم فتح الحوار، جاري فتح الماسح...');
      
      // تأخير عرض الماسح لضمان تهيئة الحوار أولاً
      const setupDialog = () => {
        // تجنب الاعتماد على الفئات العامة، استخدام فئات محددة للحوار فقط
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
        
        // تفعيل الماسح بعد تهيئة الحوار
        setTimeout(() => {
          setShowScanner(true);
        }, 100);
      };
      
      setupDialog();
      
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
  }, [open]);

  const handleScanResult = async (code: string) => {
    try {
      console.log('ScanProductDialog: تم مسح الرمز:', code);
      setIsProcessing(true);
      
      const { data: productCode, error: codeError } = await supabase
        .from('product_codes')
        .select('product_id, is_used')
        .eq('qr_code', code)
        .single();

      if (codeError) {
        console.error('Code error:', codeError);
        toast({
          title: "باركود غير معروف",
          description: "هذا الباركود غير مسجل في النظام",
          variant: "destructive"
        });
        return;
      }

      if (productCode.is_used) {
        toast({
          title: "باركود مستخدم",
          description: "تم استخدام هذا الباركود من قبل",
          variant: "destructive"
        });
        return;
      }

      const restaurantId = localStorage.getItem('restaurantId');
      if (!restaurantId) {
        throw new Error('معرف المطعم غير موجود');
      }

      const { error: updateError } = await supabase
        .from('product_codes')
        .update({ 
          is_used: true,
          used_by: restaurantId,
          used_at: new Date().toISOString()
        })
        .eq('qr_code', code);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      toast({
        title: "تم إضافة المنتج بنجاح",
        description: "تم إضافة المنتج إلى المخزون",
      });

      // إغلاق الحوار فوراً بعد إضافة المنتج بنجاح
      onOpenChange(false);
      onProductAdded();

    } catch (error: any) {
      console.error('Error processing product:', error);
      toast({
        title: "خطأ في إضافة المنتج",
        description: error.message || "حدث خطأ أثناء محاولة إضافة المنتج",
        variant: "destructive"
      });
      setHasScannerError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanClose = () => {
    onOpenChange(false);
  };

  const handleRetry = () => {
    setHasScannerError(false);
    setShowScanner(true);
  };

  return {
    isProcessing,
    hasScannerError,
    showScanner,
    handleScanResult,
    handleScanClose,
    handleRetry,
    setShowScanner
  };
};
