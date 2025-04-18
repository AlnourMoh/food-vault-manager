
import React from 'react';
import { Product } from '@/types';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MobileProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onQuantityUpdate: () => void;
}

const MobileProductDetailsDialog: React.FC<MobileProductDetailsDialogProps> = ({
  open,
  onOpenChange,
  product,
  onQuantityUpdate
}) => {
  const { toast } = useToast();

  if (!product) return null;

  const handleQuantityChange = async (change: number) => {
    const newQuantity = product.quantity + change;
    if (newQuantity < 0) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "تم تحديث الكمية",
        description: `تم تحديث كمية ${product.name} إلى ${newQuantity}`,
      });

      onQuantityUpdate();
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث الكمية",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          
          <div className="space-y-2 text-right">
            <p className="text-gray-600">التصنيف: <span className="text-gray-900">{product.category}</span></p>
            <p className="text-gray-600">الوحدة: <span className="text-gray-900">{product.unit}</span></p>
            <p className="text-gray-600">
              تاريخ الانتهاء: 
              <span className={`${new Date(product.expiryDate) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                {format(new Date(product.expiryDate), 'dd/MM/yyyy')}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xl font-semibold min-w-[3ch] text-center">
              {product.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileProductDetailsDialog;
