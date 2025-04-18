
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
    
    // Clear error when user starts typing
    if (errors[name as keyof FormError]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user makes a selection
    if (errors[name as keyof FormError]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (file: File | null, url: string) => {
    setFormData(prev => ({
      ...prev,
      image: file,
      imageUrl: url
    }));
  };

  return {
    handleInputChange,
    handleSelectChange,
    handleImageChange,
  };
};
