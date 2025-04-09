
import { FormData, FormError } from '@/components/products/types';
import { productFormSchema } from '@/validations/productFormSchema';

export const useProductFormValidation = () => {
  const validateForm = (formData: FormData): { isValid: boolean; errors: FormError } => {
    try {
      productFormSchema.parse(formData);
      return { isValid: true, errors: {} };
    } catch (error: any) {
      const formattedErrors: FormError = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            const fieldName = err.path[0];
            formattedErrors[fieldName as keyof FormError] = err.message;
          }
        });
      }
      
      return { isValid: false, errors: formattedErrors };
    }
  };

  return { validateForm };
};
