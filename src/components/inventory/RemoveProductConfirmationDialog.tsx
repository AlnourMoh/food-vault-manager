
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Product } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface RemoveProductConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  quantity: string;
  reason: string;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const RemoveProductConfirmationDialog: React.FC<RemoveProductConfirmationDialogProps> = ({
  open,
  onOpenChange,
  product,
  quantity,
  reason,
  onConfirm,
  isSubmitting
}) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            تأكيد إخراج المنتج من المخزون
          </DialogTitle>
          <DialogDescription>
            هل أنت متأكد من رغبتك في إخراج هذا المنتج من المخزون؟
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-secondary rounded-md">
            <h3 className="font-medium mb-2">تفاصيل المنتج:</h3>
            <p>اسم المنتج: {product.name}</p>
            <p>التصنيف: {product.category}</p>
            <p>الكمية المطلوب إخراجها: <span className="font-semibold">{quantity} {product.unit}</span></p>
            <p>الكمية المتبقية بعد الإخراج: <span className="font-semibold">{product.quantity - Number(quantity)} {product.unit}</span></p>
            {reason && (
              <div className="mt-2">
                <p className="font-medium">سبب الإخراج:</p>
                <p className="text-sm text-muted-foreground">{reason}</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex-row-reverse space-x-reverse">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
          <Button 
            className="bg-fvm-primary hover:bg-fvm-primary-light"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري الإخراج...' : 'تأكيد الإخراج'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveProductConfirmationDialog;
