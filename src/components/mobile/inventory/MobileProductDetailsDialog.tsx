import React from 'react';
import { Product } from '@/types';
import { format, differenceInDays } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MobileProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onProductUpdate: () => void;
}

const MobileProductDetailsDialog: React.FC<MobileProductDetailsDialogProps> = ({
  open,
  onOpenChange,
  product,
  onProductUpdate
}) => {
  const { toast } = useToast();

  if (!product) return null;

  const daysUntilExpiry = differenceInDays(new Date(product.expiryDate), new Date());
  const isExpiring = daysUntilExpiry <= 30;
  const isExpired = daysUntilExpiry < 0;

  const getExpiryStatus = () => {
    if (isExpired) {
      return <Badge variant="destructive" className="mb-2">منتهي الصلاحية</Badge>;
    }
    if (isExpiring) {
      return <Badge variant="warning" className="mb-2">ينتهي قريباً - {daysUntilExpiry} يوم متبقي</Badge>;
    }
    return null;
  };

  const handleQuantityChange = async (change: number) => {
    const newQuantity = product.quantity + change;
    if (newQuantity < 0) {
      toast({
        title: "خطأ",
        description: "لا يمكن أن تكون الكمية أقل من صفر",
        variant: "destructive",
      });
      return;
    }

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

      onProductUpdate();
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
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
              {isExpiring && (
                <div className="absolute top-2 right-2">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col gap-1 text-right">
            {getExpiryStatus()}
            <p className="text-gray-600">التصنيف: <span className="text-gray-900">{product.category}</span></p>
            <p className="text-gray-600">الوحدة: <span className="text-gray-900">{product.unit}</span></p>
            <p className="text-gray-600">
              تاريخ الإدخال: 
              <span className="text-gray-900">
                {format(new Date(product.entryDate), 'dd/MM/yyyy')}
              </span>
            </p>
            <p className="text-gray-600">
              تاريخ الانتهاء: 
              <span className={`${isExpired ? 'text-red-600' : 'text-gray-900'} font-medium`}>
                {format(new Date(product.expiryDate), 'dd/MM/yyyy')}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-600">الكمية الحالية:</span>
              <span className="font-semibold">{product.quantity} {product.unit}</span>
            </div>
            
            <div className="flex items-center justify-center gap-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileProductDetailsDialog;
