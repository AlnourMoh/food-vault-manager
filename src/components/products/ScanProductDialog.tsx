
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ScanBarcode } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScanProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void;
}

const ScanProductDialog = ({ open, onOpenChange, onProductAdded }: ScanProductDialogProps) => {
  const { toast } = useToast();
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

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
      modal={false} // مهم لضمان عدم حجب الكاميرا
    >
      <DialogContent 
        className="bg-white p-0 border shadow-lg rounded-lg" 
        style={{
          maxWidth: '100vw',
          width: '100%',
          height: '100vh',
          margin: '0',
          padding: '0',
          overflow: 'hidden'
        }}
      >
        <div className="text-center p-4 bg-primary/10 text-primary font-bold z-10 rounded-t-lg app-header">مسح باركود المنتج</div>
        <div className="h-[calc(100vh-120px)] relative flex items-center justify-center overflow-hidden"
          style={{
            position: 'relative'
          }}>
          {hasScannerError ? (
            <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-background rounded-lg">
              <div className="p-3 bg-red-100 text-red-600 rounded-full">
                <ScanBarcode className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">حدث خطأ في الماسح الضوئي</h3>
              <p className="text-center text-muted-foreground">
                لم نتمكن من الوصول إلى الكاميرا أو حدث خطأ أثناء محاولة مسح الباركود
              </p>
              <Button onClick={handleRetry} className="mt-4">
                إعادة المحاولة
              </Button>
            </div>
          ) : (
            showScanner && (
              <div className="scanner-container" style={{
                position: 'absolute',
                inset: 0,
              }}>
                <BarcodeScanner
                  onScan={handleScanResult}
                  onClose={handleScanClose}
                />
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScanProductDialog;
