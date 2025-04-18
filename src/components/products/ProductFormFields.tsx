
import React from 'react';
import { FormData, FormError } from '@/components/products/types';
import ProductInfoFields from '@/components/products/ProductInfoFields';
import CategorySelector from '@/components/products/CategorySelector';
import UnitSelector from '@/components/products/UnitSelector';

interface ProductFormFieldsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleImageChange: (file: File | null, url: string) => void;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  units: { value: string; label: string }[];
  setUnits: React.Dispatch<React.SetStateAction<{ value: string; label: string }[]>>;
  errors: FormError;
}

const ProductFormFields: React.FC<ProductFormFieldsProps> = ({ 
  formData,
  handleInputChange,
  handleSelectChange,
  handleImageChange,
  categories,
  setCategories,
  units,
  setUnits,
  errors
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ProductInfoFields 
        formData={formData} 
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        errors={errors} 
      />
      
      <CategorySelector 
        categories={categories}
        setCategories={setCategories}
        formData={formData}
        handleSelectChange={handleSelectChange}
        errors={errors}
      />
      
      <UnitSelector 
        units={units}
        setUnits={setUnits}
        formData={formData}
        handleSelectChange={handleSelectChange}
        errors={errors}
      />
    </div>
  );
};

export default ProductFormFields;
