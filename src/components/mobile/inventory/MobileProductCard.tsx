
import React from 'react';
import { format } from 'date-fns';
import { Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';

interface MobileProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({ 
  product,
  onSelect
}) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={() => onSelect(product)}
    >
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
        <h3 className="font-bold text-lg text-fvm-primary mb-2 truncate">
          {product.name}
        </h3>
        <div className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">الكمية:</span> 
            <span className="text-gray-800">{product.quantity} {product.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">تاريخ الانتهاء:</span>
            <span className={`${new Date(product.expiryDate) < new Date() ? 'text-red-600' : 'text-gray-800'}`}>
              {format(new Date(product.expiryDate), 'dd/MM/yyyy')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileProductCard;
