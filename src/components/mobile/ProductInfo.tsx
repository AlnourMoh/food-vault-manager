
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ProductInfoProps {
  productInfo: any;
  quantity: string;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  action?: string;
  showMaxQuantity?: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  productInfo,
  quantity,
  onQuantityChange,
  action = "إضافة",
  showMaxQuantity = false
}) => {
  if (!productInfo) return null;

  return (
    <>
      <Separator />
      <div className="space-y-2">
        <h3 className="font-medium">معلومات المنتج:</h3>
        <p className="text-sm">الاسم: {productInfo.name}</p>
        <p className="text-sm">الوصف: {productInfo.description || 'غير متوفر'}</p>
        <p className="text-sm">
          تاريخ الانتهاء: {productInfo.expiryDate ? 
            format(new Date(productInfo.expiryDate.toDate()), 'PPP', { locale: ar }) : 
            'غير محدد'
          }
        </p>
        {showMaxQuantity && (
          <p className="text-sm font-medium">
            الكمية المتوفرة: {productInfo.quantity || 0}
          </p>
        )}
      </div>
      <Separator />
      <div className="flex flex-col space-y-2">
        <Label htmlFor="quantity">الكمية</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={onQuantityChange}
        />
      </div>
    </>
  );
};

export default ProductInfo;
