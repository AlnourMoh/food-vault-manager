
import React from 'react';
import { 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';

const ProductFormHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle className="text-xl">إضافة منتج جديد</CardTitle>
      <CardDescription>أدخل بيانات المنتج الجديد لإضافته إلى المخزون</CardDescription>
    </CardHeader>
  );
};

export default ProductFormHeader;
