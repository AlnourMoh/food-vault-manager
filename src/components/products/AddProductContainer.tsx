
import React from 'react';
import { useProductForm } from '@/hooks/useProductForm';
import AddProductForm from '@/components/products/AddProductForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RegisteredProductsList from '@/components/mobile/RegisteredProductsList';
import { useNavigate } from 'react-router-dom';

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
  
  const navigate = useNavigate();
  
  const handleScanProduct = (barcode: string) => {
    // In web interface, navigate to the barcodes page for the product
    const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
    const basePath = isRestaurantRoute ? '/restaurant' : '';
    navigate(`${basePath}/products/${barcode}/barcodes`);
  };

  return (
    <div className="rtl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">إدخال المنتجات</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">المنتجات المسجلة</CardTitle>
            </CardHeader>
            <CardContent>
              <RegisteredProductsList onScanProduct={handleScanProduct} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddProductContainer;
