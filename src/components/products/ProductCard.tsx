
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Barcode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Product } from '@/types';
import { format } from 'date-fns';

interface ProductCardProps {
  product: Product;
  isRestaurantRoute: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isRestaurantRoute }) => {
  const navigate = useNavigate();
  
  // Get product initials for the avatar fallback
  const getProductInitials = (productName: string): string => {
    return productName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Format date in Gregorian format (DD/MM/YYYY)
  const formatDate = (date: Date): string => {
    return format(date, 'dd/MM/yyyy');
  };
  
  const viewBarcodes = (productId: string) => {
    const barcodesPath = isRestaurantRoute 
      ? `/restaurant/products/${productId}/barcodes` 
      : `/products/${productId}/barcodes`;
    navigate(barcodesPath);
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <Avatar className="h-24 w-24 bg-primary text-primary-foreground">
            <AvatarFallback className="text-3xl">
              {getProductInitials(product.name)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-fvm-primary mb-2">{product.name}</h3>
        <div className="mt-2 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">التصنيف:</span> 
            <span className="text-gray-800">{product.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">الكمية:</span> 
            <span className="text-gray-800">{product.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">تاريخ الانتهاء:</span>
            <span className={`${new Date(product.expiryDate) < new Date() ? 'text-red-600' : 'text-gray-800'}`}>
              {formatDate(new Date(product.expiryDate))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">رقم المنتج:</span>
            <span className="text-gray-800 font-mono text-xs">{product.id.substring(0, 8)}</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => viewBarcodes(product.id)}
            className="text-xs hover:bg-fvm-primary hover:text-white"
          >
            <Barcode className="h-3.5 w-3.5 ml-1.5" /> عرض الباركود
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
