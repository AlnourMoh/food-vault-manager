
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useToast } from '@/hooks/use-toast';
import AddProductForm from '@/components/products/AddProductForm';
import { FormData, FormError } from '@/components/products/types';
import { productFormSchema } from '@/validations/productFormSchema';

const AddProducts = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for form errors
  const [errors, setErrors] = useState<FormError>({});
  
  // State for categories
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
  
  // State for units
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
  });

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

  const validateForm = (): boolean => {
    try {
      productFormSchema.parse(formData);
      setErrors({});
      return true;
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
      
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "خطأ في البيانات المدخلة",
        description: "يرجى التحقق من صحة البيانات والمحاولة مرة أخرى",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate an API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      
      // Show success message
      toast({
        title: "تم إضافة المنتج بنجاح",
        description: `تم إضافة ${formData.name} إلى المخزون`,
      });
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        unit: '',
        quantity: '',
        expiryDate: '',
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  // Check current route and use appropriate layout
  const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
  const Layout = isRestaurantRoute ? RestaurantLayout : MainLayout;

  return (
    <Layout>
      <div className="rtl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">إدخال المنتجات</h1>
        
        <AddProductForm 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleSubmit}
          categories={categories}
          setCategories={setCategories}
          units={units}
          setUnits={setUnits}
          errors={errors}
          isSubmitting={isSubmitting}
        />
      </div>
    </Layout>
  );
};

export default AddProducts;
