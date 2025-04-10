
import React from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useProductAddition } from '@/hooks/mobile/useProductAddition';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import PageHeader from '@/components/mobile/PageHeader';
import ProductBarcodeInput from '@/components/mobile/ProductBarcodeInput';
import ProductInfo from '@/components/mobile/ProductInfo';
import ProductSubmitButton from '@/components/mobile/ProductSubmitButton';
import EmptyProductState from '@/components/mobile/EmptyProductState';
import BarcodeButton from '@/components/mobile/BarcodeButton';

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

  return (
    <RestaurantLayout hideSidebar={true}>
      <div className="rtl space-y-6 p-2">
        <PageHeader title="إدخال منتج" backPath="/restaurant/mobile" />
        
        {scanning ? (
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
                  action="إضافة"
                />
                
                <ProductSubmitButton 
                  onClick={handleAddProduct}
                  disabled={loading}
                />
              </>
            ) : (
              <EmptyProductState />
            )}
          </>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default MobileAddProduct;
