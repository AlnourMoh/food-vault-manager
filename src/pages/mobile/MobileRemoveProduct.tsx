
import React from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useProductRemoval } from '@/hooks/mobile/useProductRemoval';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import PageHeader from '@/components/mobile/PageHeader';
import ProductInfo from '@/components/mobile/ProductInfo';
import ProductSubmitButton from '@/components/mobile/ProductSubmitButton';
import EmptyProductState from '@/components/mobile/EmptyProductState';
import { Button } from '@/components/ui/button';
import { ScanLine } from 'lucide-react';

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
            <div className="mt-2 mb-4">
              <Button 
                onClick={() => setScanning(true)}
                className="w-full bg-fvm-primary hover:bg-fvm-primary-light text-white py-3 flex items-center justify-center gap-2"
              >
                <ScanLine className="h-5 w-5" />
                <span>مسح باركود منتج</span>
              </Button>
            </div>
            
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
                  label="تأكيد إخراج المنتج"
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
