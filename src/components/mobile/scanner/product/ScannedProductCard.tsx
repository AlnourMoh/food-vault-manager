
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Info, ShoppingCart } from 'lucide-react';

interface ScannedProductCardProps {
  product: any;
  onScanAnother: () => void;
  onViewDetails: () => void;
}

export const ScannedProductCard = ({
  product,
  onScanAnother,
  onViewDetails
}: ScannedProductCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span>معلومات المنتج</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {product.image_url && (
          <div className="flex justify-center mb-4">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="h-40 w-40 object-contain rounded-md border"
            />
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-center">{product.name}</h2>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">الفئة</p>
            <p className="font-medium">{product.category}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">الكمية المتوفرة</p>
            <p className="font-medium">{product.quantity} {product.unit || 'قطعة'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">تاريخ الإنتاج</p>
            <p className="font-medium">{formatDate(product.production_date)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">تاريخ انتهاء الصلاحية</p>
            <p className="font-medium">{formatDate(product.expiry_date)}</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onScanAnother}>
            مسح منتج آخر
          </Button>
          <Button onClick={onViewDetails} className="gap-2">
            <Info className="h-4 w-4" />
            تفاصيل أكثر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
