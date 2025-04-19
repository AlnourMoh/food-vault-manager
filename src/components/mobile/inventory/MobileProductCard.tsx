
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

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 w-full">
          {/* Image Section */}
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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

          {/* Content Section */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex flex-col w-full">
              <h3 className="text-lg font-bold text-primary mb-1 leading-tight text-right">
                {product.name}
              </h3>
              
              <div className="flex flex-wrap gap-2 justify-end mb-2">
                <Badge variant="outline" className="text-xs">
                  {product.category || "غير مصنف"}
                </Badge>
                {isExpiring && (
                  <Badge 
                    variant={isExpired ? "destructive" : "warning"} 
                    className="text-xs"
                  >
                    {isExpired ? 'منتهي الصلاحية' : `ينتهي خلال ${daysUntilExpiry} يوم`}
                  </Badge>
                )}
              </div>

              <div className="text-sm text-muted-foreground space-y-1 mb-2">
                <div className="flex justify-between">
                  <span>{product.quantity} {product.unit}</span>
                  <span>الكمية:</span>
                </div>
                <div className="flex justify-between">
                  <span className={isExpired ? 'text-destructive' : ''}>
                    {format(new Date(product.expiryDate), 'dd/MM/yyyy')}
                  </span>
                  <span>تاريخ الانتهاء:</span>
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <Button
                  variant="outline"
                  className="flex-1 bg-background hover:bg-secondary"
                  onClick={() => onRemove?.(product)}
                >
                  <ScanBarcode className="ml-2 h-4 w-4" />
                  إخراج
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => onSelect(product)}
                >
                  التفاصيل
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileProductCard;
