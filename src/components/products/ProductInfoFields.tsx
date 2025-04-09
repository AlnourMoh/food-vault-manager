
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormData } from '@/components/products/types';

interface ProductInfoFieldsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductInfoFields: React.FC<ProductInfoFieldsProps> = ({ formData, handleInputChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">اسم المنتج</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="أدخل اسم المنتج" 
          value={formData.name}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quantity">الكمية</Label>
        <Input 
          id="quantity" 
          name="quantity" 
          type="number" 
          min="0" 
          placeholder="أدخل الكمية" 
          value={formData.quantity}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expiryDate">تاريخ انتهاء الصلاحية</Label>
        <Input 
          id="expiryDate" 
          name="expiryDate" 
          type="date" 
          value={formData.expiryDate}
          onChange={handleInputChange}
          required 
        />
      </div>
    </>
  );
};

export default ProductInfoFields;
