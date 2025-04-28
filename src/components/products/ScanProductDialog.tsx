
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
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

  // عندما يفتح الحوار، نفتح الماسح فوراً
  useEffect(() => {
    if (open) {
      console.log('ScanProductDialog: تم فتح الحوار، سيتم فتح الماسح فوراً');
      setShowScanner(true);
    } else {
      console.log('ScanProductDialog: تم إغلاق الحوار');
      setShowScanner(false);
      setHasScannerError(false);
      setIsProcessing(false);
    }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle className="text-center">مسح باركود المنتج</DialogTitle>
        <div className="h-[450px] relative flex items-center justify-center">
          {hasScannerError ? (
            <div className="flex flex-col items-center justify-center space-y-4 p-4">
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
            showScanner ? (
              <BarcodeScanner
                onScan={handleScanResult}
                onClose={handleScanClose}
              />
            ) : (
              <div className="flex flex-col items-center">
                <ScanBarcode className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">جاري تحميل الماسح...</p>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScanProductDialog;
