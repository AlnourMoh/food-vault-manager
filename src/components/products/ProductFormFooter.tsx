
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface ProductFormFooterProps {
  isSubmitting: boolean;
}

const ProductFormFooter: React.FC<ProductFormFooterProps> = ({ isSubmitting }) => {
  return (
    <CardFooter className="flex justify-between">
      <Button variant="outline" type="button">إلغاء</Button>
      <Button 
        type="submit" 
        form="add-product-form" 
        className="bg-fvm-primary hover:bg-fvm-primary-light"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'جاري الإضافة...' : 'إضافة المنتج'}
      </Button>
    </CardFooter>
  );
};

export default ProductFormFooter;
