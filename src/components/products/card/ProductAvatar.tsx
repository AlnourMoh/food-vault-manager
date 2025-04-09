
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProductAvatarProps {
  productName: string;
  imageUrl: string | null;
  category: string;
}

export const ProductAvatar: React.FC<ProductAvatarProps> = ({ 
  productName, 
  imageUrl, 
  category 
}) => {
  // Get product initials for the avatar fallback
  const getProductInitials = (productName: string): string => {
    return productName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get appropriate placeholder based on product category
  const getPlaceholderImage = (category: string): string => {
    switch (category) {
      case 'خضروات':
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200";
      case 'لحوم':
        return "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=200";
      case 'بهارات':
        return "https://images.unsplash.com/photo-1532336414046-2a0e3a1dd7e5?q=80&w=200";
      case 'بقالة':
        return "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=200";
      default:
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200";
    }
  };

  const displayImageUrl = imageUrl || getPlaceholderImage(category);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <img 
        src={displayImageUrl}
        alt="صورة توضيحية للمنتج" 
        className="w-full h-full object-cover opacity-40"
      />
      <Avatar className="h-24 w-24 absolute">
        <AvatarFallback className="text-3xl bg-primary text-white">
          {getProductInitials(productName)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
