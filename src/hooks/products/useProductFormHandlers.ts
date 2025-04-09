
import { FormData, FormError } from '@/components/products/types';

export const useProductFormHandlers = (
  formData: FormData,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  errors: FormError,
  setErrors: React.Dispatch<React.SetStateAction<FormError>>
) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormError]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormError];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormError]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormError];
        return newErrors;
      });
    }
  };

  const handleImageChange = (file: File | null, url: string) => {
    setFormData(prev => ({ ...prev, image: file, imageUrl: url }));
    
    // Clear error when image is edited
    if (errors.image) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  return {
    handleInputChange,
    handleSelectChange,
    handleImageChange,
  };
};
