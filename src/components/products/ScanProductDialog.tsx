
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ScanProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void;
}

const ScanProductDialog = ({ open, onOpenChange, onProductAdded }: ScanProductDialogProps) => {
  const { toast } = useToast();

  const handleScanResult = async (code: string) => {
    try {
      // First verify if this code exists and is not used
      const { data: productCode, error: codeError } = await supabase
        .from('product_codes')
        .select('product_id, is_used')
        .eq('qr_code', code)
        .single();

      if (codeError) {
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

      // Get the restaurant ID from localStorage
      const restaurantId = localStorage.getItem('restaurantId');
      if (!restaurantId) {
        throw new Error('معرف المطعم غير موجود');
      }

      // Update the product code to mark it as used
      const { error: updateError } = await supabase
        .from('product_codes')
        .update({ 
          is_used: true,
          used_by: restaurantId,
          used_at: new Date().toISOString()
        })
        .eq('qr_code', code);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "تم إضافة المنتج بنجاح",
        description: "تم إضافة المنتج إلى المخزون",
      });

      onOpenChange(false);
      onProductAdded();

    } catch (error: any) {
      console.error('Error processing product:', error);
      toast({
        title: "خطأ في إضافة المنتج",
        description: error.message || "حدث خطأ أثناء محاولة إضافة المنتج",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle className="text-center">مسح باركود المنتج</DialogTitle>
        <div className="h-[400px] relative">
          {open && (
            <BarcodeScanner
              onScan={handleScanResult}
              onClose={() => onOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScanProductDialog;
