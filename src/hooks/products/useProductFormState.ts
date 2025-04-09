
import { useState } from 'react';
import { FormData, FormError } from '@/components/products/types';

export const useProductFormState = () => {
  const [errors, setErrors] = useState<FormError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default categories
  const [categories, setCategories] = useState([
    'بقالة',
    'لحوم',
    'ألبان',
    'خضروات',
    'فواكه',
    'بهارات',
    'زيوت',
    'مجمدات',
  ]);
  
  // Default units
  const [units, setUnits] = useState([
    { value: 'kg', label: 'كيلوغرام' },
    { value: 'g', label: 'غرام' },
    { value: 'l', label: 'لتر' },
    { value: 'ml', label: 'مليلتر' },
    { value: 'piece', label: 'قطعة' },
    { value: 'box', label: 'صندوق' },
    { value: 'pack', label: 'عبوة' },
  ]);
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    unit: '',
    quantity: '',
    expiryDate: '',
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
