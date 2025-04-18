
import { useState } from 'react';
import { FormData, FormError } from '@/components/products/types';
import { PRODUCT_CATEGORIES, PRODUCT_UNITS } from '@/constants/inventory';

export const useProductFormState = () => {
  const [errors, setErrors] = useState<FormError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Convert readonly arrays to mutable arrays for state usage
  const [categories, setCategories] = useState<string[]>([...PRODUCT_CATEGORIES]);
  
  // Convert readonly array of objects to mutable array
  const [units, setUnits] = useState<{ value: string; label: string }[]>(
    PRODUCT_UNITS.map(unit => ({ value: unit.value, label: unit.label }))
  );
  
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
