
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';

interface ProductListProps {
  products: Product[];
  getExpiryStatus: (expiryDate: Date) => {
    label: string;
    variant: "default" | "destructive" | "warning";
    icon: JSX.Element;
  };
}

const ProductList = ({ products, getExpiryStatus }: ProductListProps) => {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Archive className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">لا توجد منتجات متطابقة مع معايير البحث</p>
        </CardContent>
      </Card>
    );
  }

  return products.map(product => {
    const expiryStatus = getExpiryStatus(new Date(product.expiryDate));
    
    return (
      <Card key={product.id} className="overflow-hidden">
        <CardContent className="p-3">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <Archive className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-base truncate">{product.name}</h3>
                <Badge variant={expiryStatus.variant} className="flex items-center mr-1">
                  {expiryStatus.icon}
                  <span>{expiryStatus.label}</span>
                </Badge>
              </div>
              
              <div className="mt-1 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الكمية:</span>
                  <span>{product.quantity} {product.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">التصنيف:</span>
                  <span>{product.category || "غير مصنف"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">تاريخ الانتهاء:</span>
                  <span className={differenceInDays(new Date(product.expiryDate), new Date()) < 0 ? "text-destructive" : ""}>
                    {format(new Date(product.expiryDate), 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  });
};

export default ProductList;
