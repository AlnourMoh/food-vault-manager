
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { Separator } from '@/components/ui/separator';

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
      className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md h-full"
      onClick={() => onSelect(product)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Image and Name Section */}
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
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
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-primary mb-3 leading-tight">
                {product.name}
              </h3>
              <Badge variant="outline" className="text-sm">
                {product.category || "غير مصنف"}
              </Badge>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          {/* Details Section */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-sm text-muted-foreground block mb-2">الكمية:</span>
              <span className="font-medium text-xl">
                {product.quantity} {product.unit}
              </span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground block mb-2">تاريخ الانتهاء:</span>
              <span className={`font-medium text-xl ${isExpired ? 'text-destructive' : ''}`}>
                {format(new Date(product.expiryDate), 'dd/MM/yyyy')}
              </span>
            </div>
          </div>

          {/* Expiry Warning */}
          {isExpiring && (
            <div className={`flex items-center gap-3 p-4 rounded-lg ${
              isExpired ? 'bg-destructive/10' : 'bg-yellow-50'
            }`}>
              <AlertTriangle className={`h-6 w-6 ${
                isExpired ? 'text-destructive' : 'text-yellow-500'
              }`} />
              <span className={`text-sm font-medium ${
                isExpired ? 'text-destructive' : 'text-yellow-700'
              }`}>
                {isExpired ? 'منتهي الصلاحية' : `ينتهي خلال ${daysUntilExpiry} يوم`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileProductCard;
