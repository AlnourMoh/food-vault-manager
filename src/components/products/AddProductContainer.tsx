
import React from 'react';
import { useProductForm } from '@/hooks/useProductForm';
import AddProductForm from '@/components/products/AddProductForm';

const AddProductContainer: React.FC = () => {
  const {
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
  } = useProductForm();

  return (
    <div className="rtl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">إدخال المنتجات</h1>
      
      <AddProductForm 
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleImageChange={handleImageChange}
        handleSubmit={handleSubmit}
        categories={categories}
        setCategories={setCategories}
        units={units}
        setUnits={setUnits}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddProductContainer;
