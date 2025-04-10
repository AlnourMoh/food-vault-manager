
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  quantity: number;
  [key: string]: any;
}

interface ProductDetailsProps {
  product: Product;
  quantity: number;
  isLoading: boolean;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveProduct: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  quantity,
  isLoading,
  onQuantityChange,
  onRemoveProduct
}) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="grid gap-2">
        <Label>اسم المنتج</Label>
        <div className="rounded-md border p-2">{product.name}</div>
      </div>
      
      <div className="grid gap-2">
        <Label>الكمية المتوفرة</Label>
        <div className="rounded-md border p-2">{product.quantity}</div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="quantity">الكمية المراد إخراجها</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={onQuantityChange}
        />
      </div>
      
      <Button 
        className="w-full" 
        onClick={onRemoveProduct}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        إخراج المنتج
      </Button>
    </div>
  );
};

export default ProductDetails;
