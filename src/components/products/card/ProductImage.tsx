
import React from 'react';
import { ProductAvatar } from './ProductAvatar';

interface ProductImageProps {
  imageUrl: string | null;
  productName: string;
  category: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ 
  imageUrl, 
  productName, 
  category 
}) => {
  return (
    <div className="w-24 h-24 bg-gray-100 flex-shrink-0 rounded-lg overflow-hidden">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={productName} 
          className="w-full h-full object-cover"
        />
      ) : (
        <ProductAvatar 
          productName={productName} 
          imageUrl={imageUrl} 
          category={category} 
        />
      )}
    </div>
  );
};
