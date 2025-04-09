
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { FormData, FormError } from '@/components/products/types';
import CategorySelector from '@/components/products/CategorySelector';
import UnitSelector from '@/components/products/UnitSelector';
import ProductInfoFields from '@/components/products/ProductInfoFields';

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
      <CardHeader>
        <CardTitle className="text-xl">إضافة منتج جديد</CardTitle>
        <CardDescription>أدخل بيانات المنتج الجديد لإضافته إلى المخزون</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="add-product-form" onSubmit={handleSubmit} className="space-y-6">
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
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button">إلغاء</Button>
        <Button 
          type="submit" 
          form="add-product-form" 
          className="bg-fvm-primary hover:bg-fvm-primary-light"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'جاري الإضافة...' : 'إضافة المنتج'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddProductForm;
