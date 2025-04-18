
import { useState } from 'react';
import { FormData, FormError } from '@/components/products/types';

export const useProductFormState = () => {
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

  const [errors, setErrors] = useState<FormError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default categories and units
  const [categories, setCategories] = useState<string[]>([
    'خضروات',
    'فواكه',
    'لحوم',
    'دواجن',
    'بهارات',
    'حبوب',
    'معلبات'
  ]);

  const [units, setUnits] = useState([
    { value: 'piece', label: 'قطعة' },
    { value: 'kg', label: 'كيلوجرام' },
    { value: 'g', label: 'جرام' },
    { value: 'l', label: 'لتر' },
    { value: 'ml', label: 'مل' },
    { value: 'box', label: 'صندوق' },
    { value: 'pack', label: 'عبوة' }
  ]);

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
