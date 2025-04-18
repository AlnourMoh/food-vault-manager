
import { useState } from 'react';
import { FormData, FormError } from '@/components/products/types';
import { PRODUCT_CATEGORIES, PRODUCT_UNITS } from '@/constants/inventory';

export const useProductFormState = () => {
  const [errors, setErrors] = useState<FormError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use predefined categories from constants
  const [categories, setCategories] = useState(PRODUCT_CATEGORIES);
  
  // Use predefined units from constants
  const [units, setUnits] = useState(PRODUCT_UNITS);
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    unit: '',
    quantity: '',
    expiryDate: '',
    productionDate: '',
    image: null,
    imageUrl: '',
  });

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    categories,
    setCategories,
    units,
    setUnits
  };
};
