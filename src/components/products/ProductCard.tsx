
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Barcode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  
  // Default placeholder image for food products
  const placeholderImageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200";
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={placeholderImageUrl}
              alt="صورة توضيحية للمنتج" 
              className="w-full h-full object-cover opacity-40"
            />
            <Avatar className="h-24 w-24 absolute">
              <AvatarFallback className="text-3xl bg-primary text-white">
                {getProductInitials(product.name)}
              </AvatarFallback>
            </Avatar>
          </div>
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
