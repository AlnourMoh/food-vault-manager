
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Package, ScanBarcode } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface MobileProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onRemove?: (product: Product) => void;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({ 
  product,
  onSelect,
  onRemove
}) => {
  const daysUntilExpiry = differenceInDays(new Date(product.expiryDate), new Date());
  const isExpiring = daysUntilExpiry <= 30;
  const isExpired = daysUntilExpiry < 0;

  const getCardClasses = () => {
    if (isExpired) {
      return "bg-red-50/80 border-red-200 hover:bg-red-100/80";
    }
    if (isExpiring) {
      return "bg-yellow-50/80 border-yellow-200 hover:bg-yellow-100/80";
    }
    return "bg-background hover:bg-secondary/5";
  };

  return (
    <Card className={`w-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden border-t-4 border-t-primary ${getCardClasses()}`}>
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Image Header */}
          <div className={`relative w-full h-32 ${!product.imageUrl ? 'bg-gradient-to-r from-gray-50 to-gray-100' : ''}`}>
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
            <div className="absolute top-2 right-2 flex gap-2">
              {isExpiring && (
                <Badge 
                  variant={isExpired ? "destructive" : "warning"} 
                  className={`text-xs shadow-lg ${isExpired ? 'animate-pulse' : ''}`}
                >
                  {isExpired ? 'منتهي الصلاحية' : `ينتهي خلال ${daysUntilExpiry} يوم`}
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="text-xs">
                {product.category || "غير مصنف"}
              </Badge>
              <h3 className="text-lg font-bold text-primary leading-tight text-right">
                {product.name}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">الكمية:</span>
                <span className="text-foreground">{product.quantity} {product.unit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">تاريخ الانتهاء:</span>
                <span className={isExpired ? 'text-destructive font-medium' : 'text-foreground'}>
                  {format(new Date(product.expiryDate), 'dd/MM/yyyy')}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 bg-background hover:bg-secondary transition-colors duration-300"
                onClick={() => onRemove?.(product)}
              >
                <ScanBarcode className="ml-2 h-4 w-4" />
                امسح
              </Button>
              <Button
                variant="secondary"
                className="flex-1 hover:bg-primary hover:text-white transition-colors duration-300"
                onClick={() => onSelect(product)}
              >
                التفاصيل
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileProductCard;
