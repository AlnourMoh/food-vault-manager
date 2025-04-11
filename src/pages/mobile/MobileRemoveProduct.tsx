
import React, { useState } from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useProductRemoval } from '@/hooks/mobile/useProductRemoval';
import PageHeader from '@/components/mobile/PageHeader';
import { useInventoryProducts } from '@/hooks/mobile/useInventoryProducts';
import ProductScannerSection from '@/components/mobile/forms/ProductScannerSection';
import ProductEntryForm from '@/components/mobile/forms/ProductEntryForm';
import InventoryProductsList from '@/components/mobile/forms/InventoryProductsList';

const MobileRemoveProduct = () => {
  const {
    scanning,
    setScanning,
    quantity,
    productInfo,
    loading,
    handleQuantityChange,
    handleScanResult,
    handleRemoveProduct
  } = useProductRemoval();

  const { products, loading: productsLoading } = useInventoryProducts();

  // تابع لاختيار منتج من القائمة او مسح الباركود
  const handleSelectProduct = (productBarcode: string) => {
    if (productBarcode) {
      handleScanResult(productBarcode);
    }
  };

  return (
    <RestaurantLayout hideSidebar={true}>
      <div className="rtl space-y-6 p-2">
        <PageHeader title="إخراج منتج" backPath="/restaurant/mobile" />
        
        {scanning ? (
          <ProductScannerSection 
            isScanning={scanning}
            setScanning={setScanning}
            handleScanResult={handleScanResult}
          />
        ) : (
          <>
            <ProductScannerSection 
              isScanning={scanning}
              setScanning={setScanning}
              handleScanResult={handleScanResult}
            />
            
            {productInfo ? (
              <ProductEntryForm 
                productInfo={productInfo}
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
                handleSubmit={handleRemoveProduct}
                loading={loading}
                isAddForm={false}
              />
            ) : (
              <InventoryProductsList 
                products={products} 
                loading={productsLoading} 
                onSelectProduct={handleSelectProduct} 
              />
            )}
          </>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default MobileRemoveProduct;
