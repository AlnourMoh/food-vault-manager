import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { ProductImage } from './card/ProductImage';
import { ProductDetails } from './card/ProductDetails';
import { ProductActions } from './card/ProductActions';
import { DeleteProductDialog } from './card/DeleteProductDialog';

interface ProductCardProps {
  product: Product;
  isRestaurantRoute: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isRestaurantRoute }) => {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteProduct = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('products')
        .update({ status: 'removed' })
        .eq('id', product.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "تم حذف المنتج",
        description: `تم حذف المنتج ${product.name} بنجاح`,
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "خطأ في حذف المنتج",
        description: error.message || "حدث خطأ أثناء محاولة حذف المنتج",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  return (
    <>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="flex p-4 gap-4">
          <ProductImage 
            imageUrl={product.imageUrl} 
            productName={product.name}
            category={product.category}
          />
          <div className="flex-1 min-w-0">
            <ProductDetails 
              name={product.name}
              category={product.category}
              quantity={product.quantity}
              expiryDate={product.expiryDate}
              id={product.id}
            />
            <div className="mt-4">
              <ProductActions 
                productId={product.id}
                isRestaurantRoute={isRestaurantRoute}
                onDeleteClick={() => setIsDeleteDialogOpen(true)}
              />
            </div>
          </div>
        </div>
      </Card>

      <DeleteProductDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        productName={product.name}
        isDeleting={isDeleting}
        onConfirmDelete={handleDeleteProduct}
      />
    </>
  );
};

export default ProductCard;
