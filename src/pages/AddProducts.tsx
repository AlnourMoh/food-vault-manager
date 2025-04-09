
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useToast } from '@/hooks/use-toast';
import AddProductForm from '@/components/products/AddProductForm';
import { FormData } from '@/components/products/types';

const AddProducts = () => {
  const { toast } = useToast();
  
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
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        />
      </div>
    </Layout>
  );
};

export default AddProducts;
