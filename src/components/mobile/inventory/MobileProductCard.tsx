
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';

interface MobileProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({ 
  product,
  onSelect
}) => {
  const daysUntilExpiry = differenceInDays(new Date(product.expiryDate), new Date());
  const isExpiring = daysUntilExpiry <= 30;
  const isExpired = daysUntilExpiry < 0;

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
        {isExpiring && (
          <div className="absolute top-2 right-2">
            <AlertTriangle className={`h-5 w-5 ${isExpired ? 'text-red-500' : 'text-yellow-500'}`} />
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-bold text-lg text-fvm-primary mb-2 truncate">
          {product.name}
        </h3>
        {isExpiring && (
          <Badge 
            variant={isExpired ? "destructive" : "warning"} 
            className="mb-2 w-full justify-center"
          >
            {isExpired ? 'منتهي الصلاحية' : `ينتهي خلال ${daysUntilExpiry} يوم`}
          </Badge>
        )}
        <div className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">الكمية:</span> 
            <span className="text-gray-800">{product.quantity} {product.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">تاريخ الانتهاء:</span>
            <span className={`${isExpired ? 'text-red-600' : 'text-gray-800'}`}>
              {format(new Date(product.expiryDate), 'dd/MM/yyyy')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileProductCard;
