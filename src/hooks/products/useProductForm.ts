
import { useProductFormState } from '@/hooks/products/useProductFormState';
import { useProductFormHandlers } from '@/hooks/products/useProductFormHandlers';
import { useProductFormValidation } from '@/hooks/products/useProductFormValidation';
import { useProductFormSubmit } from '@/hooks/products/useProductFormSubmit';
import { ProductFormHookReturn } from '@/hooks/products/types';

export const useProductForm = (): ProductFormHookReturn => {
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting: formStateIsSubmitting,
    setIsSubmitting,
    categories,
    setCategories,
    units,
    setUnits
  } = useProductFormState();

  const { validateForm } = useProductFormValidation();

  const {
    handleInputChange,
    handleSelectChange,
    handleImageChange,
  } = useProductFormHandlers(formData, setFormData, errors, setErrors);

  const { 
    handleSubmit: submitHandler, 
    isSubmitting: submitIsSubmitting
  } = useProductFormSubmit(
    formData, 
    setFormData, 
    (formData) => {
      const result = validateForm(formData);
      if (!result.isValid) {
        setErrors(result.errors);
      }
      return result;
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Ensure the form doesn't actually submit
    const { isValid, errors: validationErrors } = validateForm(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    
    // Only call submitHandler if validation passed
    submitHandler(e);
  };

  // Use the isSubmitting state from the form submission hook
  const isSubmitting = submitIsSubmitting;

  return {
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
    handleSubmit
  };
};
