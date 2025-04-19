
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
      <CardContent className="p-3 flex gap-4">
        <div className="w-20 h-20 bg-gray-100 flex-shrink-0 rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-fvm-primary truncate">
            {product.name}
          </h3>
          <div className="mt-1 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">الكمية:</span> 
              <span className="text-gray-800">{product.quantity} {product.unit}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">تاريخ الانتهاء:</span>
              <span className={`${isExpired ? 'text-red-600' : 'text-gray-800'}`}>
                {format(new Date(product.expiryDate), 'dd/MM/yyyy')}
              </span>
            </div>
          </div>
          {isExpiring && (
            <Badge 
              variant={isExpired ? "destructive" : "warning"} 
              className="mt-2 w-full justify-center"
            >
              {isExpired ? 'منتهي الصلاحية' : `ينتهي خلال ${daysUntilExpiry} يوم`}
            </Badge>
          )}
        </div>
        {isExpiring && (
          <div className="flex-shrink-0">
            <AlertTriangle className={`h-5 w-5 ${isExpired ? 'text-red-500' : 'text-yellow-500'}`} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileProductCard;
