
import React from 'react';
import { format } from 'date-fns';
import { Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';

interface MobileProductCardProps {
  product: Product;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative bg-gray-100">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-bold text-sm mb-1 text-fvm-primary truncate">
          {product.name}
        </h3>
        <div className="text-xs space-y-1">
          <p className="text-gray-600">الكمية: {product.quantity}</p>
          <p className={`${new Date(product.expiryDate) < new Date() ? 'text-red-600' : 'text-gray-600'}`}>
            تاريخ الانتهاء: {format(new Date(product.expiryDate), 'dd/MM/yyyy')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileProductCard;
