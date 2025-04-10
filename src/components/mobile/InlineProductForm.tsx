
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useProductAddition } from '@/hooks/mobile/useProductAddition';
import { useProductRemoval } from '@/hooks/mobile/useProductRemoval';
import { useProductRegistration } from '@/hooks/mobile/useProductRegistration';
import { useInventoryProducts } from '@/hooks/mobile/useInventoryProducts';
import RegisterProductForm from './RegisterProductForm';
import ProductScannerSection from './forms/ProductScannerSection';
import ProductEntryForm from './forms/ProductEntryForm';
import InventoryProductsList from './forms/InventoryProductsList';
import UnauthorizedAccessCard from './forms/UnauthorizedAccessCard';

interface InlineProductFormProps {
  formType: 'add' | 'remove' | 'register';
  onClose: () => void;
}

const InlineProductForm: React.FC<InlineProductFormProps> = ({ formType, onClose }) => {
  const [userRole, setUserRole] = useState<string>('');
  
  useEffect(() => {
    // Get the user role from localStorage
    const role = localStorage.getItem('teamMemberRole') || '';
    setUserRole(role);
  }, []);

  // Check if user is a system admin
  const isSystemAdmin = userRole === 'إدارة النظام';
  
  // Close form if user tries to access register form without admin rights
  useEffect(() => {
    if (formType === 'register' && !isSystemAdmin) {
      onClose();
    }
  }, [formType, isSystemAdmin, onClose]);

  // For Add Product Form
  const {
    scanning: addScanning,
    setScanning: setAddScanning,
    quantity: addQuantity,
    setQuantity: setAddQuantity,
    productInfo: addProductInfo,
    loading: addLoading,
    handleScanResult: handleAddScanResult,
    handleAddProduct
  } = useProductAddition();

  // For Remove Product Form
  const {
    scanning: removeScanning,
    setScanning: setRemoveScanning,
    quantity: removeQuantity,
    setQuantity: setRemoveQuantity,
    loading: removeLoading,
    productInfo: removeProductInfo,
    handleScanResult: handleRemoveScanResult,
    handleRemoveProduct
  } = useProductRemoval();

  // For Register Product Form (System Admin)
  const {
    loading: registerLoading,
    handleRegisterProduct
  } = useProductRegistration();

  // Get inventory products
  const { products: inventoryProducts, loading: inventoryLoading } = useInventoryProducts();

  const handleAddQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddQuantity(e.target.value);
  };

  const handleRemoveQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemoveQuantity(e.target.value);
  };

  // Select a product from the list
  const handleSelectProduct = (productBarcode: string) => {
    if (formType === 'add') {
      handleAddScanResult(productBarcode);
    } else if (formType === 'remove') {
      handleRemoveScanResult(productBarcode);
    }
  };

  // Determine which form to show
  const isAddForm = formType === 'add';
  const isRemoveForm = formType === 'remove';
  const isRegisterForm = formType === 'register';
  
  // Return unauthorized access card if non-admin tries to access register form
  if (isRegisterForm && !isSystemAdmin) {
    return <UnauthorizedAccessCard onClose={onClose} />;
  }
  
  // Render add/remove product forms
  if (!isRegisterForm) {
    const isScanning = isAddForm ? addScanning : removeScanning;
    const setScanning = isAddForm ? setAddScanning : setRemoveScanning;
    const productInfo = isAddForm ? addProductInfo : removeProductInfo;
    const quantity = isAddForm ? addQuantity : removeQuantity;
    const handleQuantityChange = isAddForm ? handleAddQuantityChange : handleRemoveQuantityChange;
    const loading = isAddForm ? addLoading : removeLoading;
    const handleScanResult = isAddForm ? handleAddScanResult : handleRemoveScanResult;
    const handleSubmit = isAddForm ? handleAddProduct : handleRemoveProduct;
    const products = isAddForm ? [] : inventoryProducts; // Only show inventory products for removal
    const productsLoading = isAddForm ? false : inventoryLoading;

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">
            {isAddForm ? 'إدخال منتج' : 'إخراج منتج'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ProductScannerSection 
              isScanning={isScanning}
              setScanning={setScanning}
              handleScanResult={handleScanResult}
            />
            
            {productInfo ? (
              <ProductEntryForm
                productInfo={productInfo}
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
                handleSubmit={handleSubmit}
                loading={loading}
                isAddForm={isAddForm}
              />
            ) : (
              isRemoveForm && products.length > 0 && (
                <InventoryProductsList
                  products={products}
                  loading={productsLoading}
                  onSelectProduct={handleSelectProduct}
                />
              )
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render register product form
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">تسجيل منتج جديد</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <RegisterProductForm 
          onSubmit={handleRegisterProduct}
          loading={registerLoading}
        />
      </CardContent>
    </Card>
  );
};

export default InlineProductForm;
