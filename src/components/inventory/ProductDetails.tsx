
import React from 'react';
import { Product } from '@/types';

interface ProductDetailsProps {
  product: Product | null;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  if (!product) return null;

  return (
    <div className="p-4 bg-secondary rounded-md">
      <h3 className="font-medium mb-2">تفاصيل المنتج:</h3>
      <p>اسم المنتج: {product.name}</p>
      <p>التصنيف: {product.category}</p>
      <p>الكمية المتاحة: {product.quantity} {product.unit}</p>
      <p>تاريخ انتهاء الصلاحية: {new Date(product.expiryDate).toLocaleDateString('ar-SA')}</p>
    </div>
  );
};

export default ProductDetails;
