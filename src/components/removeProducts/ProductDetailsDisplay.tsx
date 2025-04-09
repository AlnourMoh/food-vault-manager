
import React from 'react';
import { Product } from '@/types';

interface ProductDetailsDisplayProps {
  selectedProductDetails: Product | null;
}

const ProductDetailsDisplay: React.FC<ProductDetailsDisplayProps> = ({ 
  selectedProductDetails 
}) => {
  if (!selectedProductDetails) return null;
  
  return (
    <div className="p-4 bg-secondary rounded-md">
      <h3 className="font-medium mb-2">تفاصيل المنتج:</h3>
      <p>اسم المنتج: {selectedProductDetails.name}</p>
      <p>التصنيف: {selectedProductDetails.category}</p>
      <p>الكمية المتاحة: {selectedProductDetails.quantity} {selectedProductDetails.unit}</p>
      <p>تاريخ انتهاء الصلاحية: {new Date(selectedProductDetails.expiryDate).toLocaleDateString('ar-SA')}</p>
    </div>
  );
};

export default ProductDetailsDisplay;
