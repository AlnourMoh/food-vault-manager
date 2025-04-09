
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FormData, FormError, Unit } from '@/components/products/types';
import ProductFormFields from '@/components/products/ProductFormFields';

interface EditProductFormProps {
  formData: FormData;
  errors: FormError;
  isSubmitting: boolean;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  units: Unit[];
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleImageChange: (file: File | null, url: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({
  formData,
  errors,
  isSubmitting,
  categories,
  setCategories,
  units,
  setUnits,
  handleInputChange,
  handleSelectChange,
  handleImageChange,
  handleSubmit,
  handleCancel
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      
      <div className="flex justify-end space-x-4 space-x-reverse pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          إلغاء
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الحفظ...
            </>
          ) : (
            "حفظ التعديلات"
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditProductForm;
