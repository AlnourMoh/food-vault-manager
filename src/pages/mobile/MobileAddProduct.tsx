
import React, { useState } from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import PageHeader from '@/components/mobile/PageHeader';
import { useProductAddition } from '@/hooks/mobile/useProductAddition';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import ProductBarcodeInput from '@/components/mobile/ProductBarcodeInput';
import ProductInfo from '@/components/mobile/ProductInfo';
import ProductSubmitButton from '@/components/mobile/ProductSubmitButton';
import EmptyProductState from '@/components/mobile/EmptyProductState';
import RegisteredProductsList from '@/components/mobile/RegisteredProductsList';

const MobileAddProduct = () => {
  const {
    scanning,
    setScanning,
    barcode,
    setBarcode,
    quantity,
    setQuantity,
    productInfo,
    loading,
    handleScanResult,
    handleAddProduct
  } = useProductAddition();

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  };

  const handleScanRegisteredProduct = (code: string) => {
    setBarcode(code);
    handleScanResult(code);
  };

  return (
    <RestaurantLayout hideSidebar={true}>
      <div className="rtl space-y-4 p-3">
        <PageHeader
          title="إدخال منتج"
          backPath="/restaurant/mobile"
        />

        {scanning ? (
          <BarcodeScanner 
            onScanResult={handleScanResult}
            onCancel={() => setScanning(false)}
          />
        ) : (
          <div className="space-y-4">
            <ProductBarcodeInput
              barcode={barcode}
              onChange={handleBarcodeChange}
              onScan={() => setScanning(true)}
            />

            {productInfo ? (
              <>
                <ProductInfo 
                  productInfo={productInfo}
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  action="إضافة"
                  showMaxQuantity={false}
                />
                
                <ProductSubmitButton 
                  onClick={handleAddProduct}
                  disabled={loading}
                  label="تأكيد إدخال المنتج"
                />
              </>
            ) : (
              <EmptyProductState />
            )}

            {/* Display registered products waiting to be added to inventory */}
            {!productInfo && <RegisteredProductsList onScanProduct={handleScanRegisteredProduct} />}
          </div>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default MobileAddProduct;
