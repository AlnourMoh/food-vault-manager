
import React from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useProductRemoval } from '@/hooks/mobile/useProductRemoval';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import PageHeader from '@/components/mobile/PageHeader';
import ProductBarcodeInput from '@/components/mobile/ProductBarcodeInput';
import ProductInfo from '@/components/mobile/ProductInfo';
import ProductSubmitButton from '@/components/mobile/ProductSubmitButton';
import EmptyProductState from '@/components/mobile/EmptyProductState';
import BarcodeButton from '@/components/mobile/BarcodeButton';

const MobileRemoveProduct = () => {
  const {
    scanning,
    setScanning,
    barcode,
    setBarcode,
    quantity,
    setQuantity,
    productInfo,
    loading,
    handleBarcodeChange,
    handleQuantityChange,
    handleScanResult,
    handleRemoveProduct
  } = useProductRemoval();

  return (
    <RestaurantLayout hideSidebar={true}>
      <div className="rtl space-y-6 p-2">
        <PageHeader title="إخراج منتج" backPath="/restaurant/mobile" />
        
        {scanning ? (
          <BarcodeScanner 
            onScanResult={handleScanResult}
            onCancel={() => setScanning(false)}
          />
        ) : (
          <>
            <ProductBarcodeInput
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
                  action="إخراج"
                  showMaxQuantity={true}
                />
                
                <ProductSubmitButton 
                  onClick={handleRemoveProduct}
                  disabled={loading || (productInfo?.quantity === 0)}
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

export default MobileRemoveProduct;
