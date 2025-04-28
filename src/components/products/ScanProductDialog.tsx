
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

  useEffect(() => {
    if (open) {
      console.log('ScanProductDialog: تم فتح الحوار، جاري فتح الماسح...');
      
      // إعداد شفافية الصفحة للكاميرا فورًا
      document.documentElement.style.background = 'transparent';
      document.documentElement.style.backgroundColor = 'transparent';
      document.body.style.background = 'transparent';
      document.body.style.backgroundColor = 'transparent';
      document.body.classList.add('scanner-active');
      
      // تأكد من تهيئة الحوار بشكل صحيح للكاميرا
      const setupDialog = () => {
        // تطبيق الشفافية على كل الطبقات المركبة
        document.querySelectorAll('[role="dialog"], [class*="DialogOverlay"], [class*="DialogContent"]').forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.background = 'transparent';
            element.style.backgroundColor = 'transparent';
            element.style.setProperty('--background', 'transparent', 'important');
            element.style.boxShadow = 'none';
          }
        });
        
        // جعل جميع العناصر الداخلية شفافة أيضًا
        document.querySelectorAll('.dialog-inner-content, .dialog-background, .dialog-container').forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.background = 'transparent';
            element.style.backgroundColor = 'transparent';
            element.style.setProperty('--background', 'transparent', 'important');
          }
        });
        
        // تفعيل الماسح بعد تهيئة الحوار
        setTimeout(() => {
          setShowScanner(true);
        }, 100);
      };
      
      // استخدام setTimeout لضمان تهيئة DOM قبل محاولة تعديله
      setupDialog();
      
      // إعادة تعيين حالة الماسح
      setHasScannerError(false);
      setIsProcessing(false);
    } else {
      console.log('ScanProductDialog: تم إغلاق الحوار');
      setShowScanner(false);
      
      // إعادة ضبط أنماط الصفحة عند الإغلاق
      document.documentElement.style.background = '';
      document.documentElement.style.backgroundColor = '';
      document.body.style.background = '';
      document.body.style.backgroundColor = '';
      document.body.classList.remove('scanner-active');
    }
    
    // تنظيف عند إزالة المكون
    return () => {
      console.log('ScanProductDialog: تنظيف الموارد');
      
      // إعادة تعيين الأنماط للحوارات إذا كانت موجودة
      document.querySelectorAll('[role="dialog"], [class*="DialogContent"], [class*="DialogOverlay"]').forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.background = '';
          element.style.backgroundColor = '';
          element.style.removeProperty('--background');
          element.style.boxShadow = '';
        }
      });
      
      // إعادة ضبط أنماط الصفحة
      document.documentElement.style.background = '';
      document.documentElement.style.backgroundColor = '';
      document.body.style.background = '';
      document.body.style.backgroundColor = '';
      document.body.classList.remove('scanner-active');
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
      modal={false} // هذا مهم لضمان عدم حجب الكاميرا
    >
      <DialogContent 
        className="bg-transparent p-0 border-0 dialog-background" 
        style={{
          backgroundColor: 'transparent',
          background: 'transparent', 
          boxShadow: 'none',
          maxWidth: '100vw',
          width: '100%',
          height: '100vh',
          margin: '0',
          padding: '0',
          overflow: 'hidden'
        }}
      >
        <div className="text-center p-4 bg-black/70 text-white z-10 rounded-t-lg">مسح باركود المنتج</div>
        <div className="h-[calc(100vh-120px)] relative flex items-center justify-center bg-transparent overflow-hidden dialog-inner-content"
          style={{
            background: 'transparent',
            backgroundColor: 'transparent',
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
              <div className="dialog-container" style={{
                position: 'absolute',
                inset: 0,
                background: 'transparent',
                backgroundColor: 'transparent',
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
