
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormData, FormError } from '@/components/products/types';

interface ProductInfoFieldsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FormError;
}

const ProductInfoFields: React.FC<ProductInfoFieldsProps> = ({ formData, handleInputChange, errors }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>اسم المنتج</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="أدخل اسم المنتج" 
          value={formData.name}
          onChange={handleInputChange}
          required 
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quantity" className={errors.quantity ? "text-destructive" : ""}>الكمية</Label>
        <Input 
          id="quantity" 
          name="quantity" 
          type="number" 
          min="0" 
          step="0.01"
          placeholder="أدخل الكمية" 
          value={formData.quantity}
          onChange={handleInputChange}
          required 
          className={errors.quantity ? "border-destructive" : ""}
        />
        {errors.quantity && (
          <p className="text-xs text-destructive">{errors.quantity}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expiryDate" className={errors.expiryDate ? "text-destructive" : ""}>تاريخ انتهاء الصلاحية</Label>
        <Input 
          id="expiryDate" 
          name="expiryDate" 
          type="date" 
          value={formData.expiryDate}
          onChange={handleInputChange}
          required 
          className={errors.expiryDate ? "border-destructive" : ""}
        />
        {errors.expiryDate && (
          <p className="text-xs text-destructive">{errors.expiryDate}</p>
        )}
      </div>
    </>
  );
};

export default ProductInfoFields;
