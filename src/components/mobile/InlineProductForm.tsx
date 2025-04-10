
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useProductAddition } from '@/hooks/mobile/useProductAddition';
import { useProductRemoval } from '@/hooks/mobile/useProductRemoval';
import { useProductRegistration } from '@/hooks/mobile/useProductRegistration';
import BarcodeScanner from './BarcodeScanner';
import ProductBarcodeInput from './ProductBarcodeInput';
import ProductInfo from './ProductInfo';
import ProductSubmitButton from './ProductSubmitButton';
import EmptyProductState from './EmptyProductState';
import BarcodeButton from './BarcodeButton';
import RegisterProductForm from './RegisterProductForm';

interface InlineProductFormProps {
  formType: 'add' | 'remove' | 'register';
  onClose: () => void;
}

const InlineProductForm: React.FC<InlineProductFormProps> = ({ formType, onClose }) => {
  // For Add Product Form
  const {
    scanning: addScanning,
    setScanning: setAddScanning,
    barcode: addBarcode,
    setBarcode: setAddBarcode,
    quantity: addQuantity,
    setQuantity: setAddQuantity,
    productInfo: addProductInfo,
    loading: addLoading,
    handleScanResult: handleAddScanResult,
    handleAddProduct
  } = useProductAddition();

  // For Remove Product Form
  const {
    barcode: removeBarcode,
    setBarcode: setRemoveBarcode,
    quantity: removeQuantity,
    setQuantity: setRemoveQuantity,
    loading: removeLoading,
    scanning: removeScanning,
    setScanning: setRemoveScanning,
    productInfo: removeProductInfo,
    handleScanResult: handleRemoveScanResult,
    handleRemoveProduct
  } = useProductRemoval();

  // For Register Product Form (System Admin)
  const {
    loading: registerLoading,
    handleRegisterProduct
  } = useProductRegistration();

  // Handlers for add product form
  const handleAddBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddBarcode(e.target.value);
  };

  const handleAddQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddQuantity(e.target.value);
  };

  // Handlers for remove product form
  const handleRemoveBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemoveBarcode(e.target.value);
  };

  const handleRemoveQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemoveQuantity(e.target.value);
  };

  // Determine which form to show
  const isAddForm = formType === 'add';
  const isRemoveForm = formType === 'remove';
  const isRegisterForm = formType === 'register';
  
  // Only for add and remove forms
  if (!isRegisterForm) {
    const isScanning = isAddForm ? addScanning : removeScanning;
    const setScanning = isAddForm ? setAddScanning : setRemoveScanning;
    const barcode = isAddForm ? addBarcode : removeBarcode;
    const handleBarcodeChange = isAddForm ? handleAddBarcodeChange : handleRemoveBarcodeChange;
    const productInfo = isAddForm ? addProductInfo : removeProductInfo;
    const quantity = isAddForm ? addQuantity : removeQuantity;
    const handleQuantityChange = isAddForm ? handleAddQuantityChange : handleRemoveQuantityChange;
    const loading = isAddForm ? addLoading : removeLoading;
    const handleScanResult = isAddForm ? handleAddScanResult : handleRemoveScanResult;
    const handleSubmit = isAddForm ? handleAddProduct : handleRemoveProduct;

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
            {isScanning ? (
              <BarcodeScanner 
                onScanResult={handleScanResult}
                onCancel={() => setScanning(false)}
              />
            ) : (
              <>
                <ProductBarcodeInput
                  barcode={barcode}
                  onChange={handleBarcodeChange}
                  onScan={() => setScanning(true)}
                />
                
                <BarcodeButton 
                  onClick={() => setScanning(true)}
                  buttonText="مسح الباركود"
                />
                
                {productInfo ? (
                  <>
                    <ProductInfo 
                      productInfo={productInfo}
                      quantity={quantity}
                      onQuantityChange={handleQuantityChange}
                      action={isAddForm ? "إضافة" : "إخراج"}
                      showMaxQuantity={!isAddForm}
                    />
                    
                    <ProductSubmitButton 
                      onClick={handleSubmit}
                      disabled={loading || (!isAddForm && (removeProductInfo?.quantity === 0))}
                      label={isAddForm ? "تأكيد إدخال المنتج" : "تأكيد إخراج المنتج"}
                    />
                  </>
                ) : (
                  <EmptyProductState />
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // For register form
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
