
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormData, FormError } from '@/components/products/types';
import ProductFormHeader from '@/components/products/ProductFormHeader';
import ProductFormFields from '@/components/products/ProductFormFields';
import ProductFormFooter from '@/components/products/ProductFormFooter';

interface AddProductFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleImageChange: (file: File | null, url: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  units: { value: string; label: string }[];
  setUnits: React.Dispatch<React.SetStateAction<{ value: string; label: string }[]>>;
  errors: FormError;
  isSubmitting: boolean;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleImageChange,
  handleSubmit,
  categories,
  setCategories,
  units,
  setUnits,
  errors,
  isSubmitting
}) => {
  return (
    <Card className="max-w-2xl mx-auto">
      <ProductFormHeader />
      
      <CardContent>
        <form id="add-product-form" onSubmit={handleSubmit} className="space-y-6">
          <ProductFormFields 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleImageChange={handleImageChange}
            categories={categories}
            setCategories={setCategories}
            units={units}
            setUnits={setUnits}
            errors={errors}
          />
        </form>
      </CardContent>
      
      <ProductFormFooter isSubmitting={isSubmitting} />
    </Card>
  );
};

export default AddProductForm;
