
import React from 'react';

interface AddProductHeaderProps {
  title?: string;
  description?: string;
}

export const AddProductHeader: React.FC<AddProductHeaderProps> = ({ 
  title = "إضافة منتج جديد",
  description = "قم بمسح الباركود الموجود على المنتج لإضافته إلى المخزون"
}) => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
