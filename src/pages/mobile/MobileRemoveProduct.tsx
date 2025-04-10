
import React from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import useDeviceDetection from '@/hooks/useDeviceDetection';
import { Card, CardContent } from '@/components/ui/card';
import { useProductRemoval } from '@/hooks/mobile/useProductRemoval';
import BarcodeInputSection from '@/components/mobile/BarcodeInputSection';
import ProductDetails from '@/components/mobile/ProductDetails';
import PageHeader from '@/components/mobile/PageHeader';

const MobileRemoveProduct = () => {
  const { isMobile } = useDeviceDetection();
  const {
    barcode,
    quantity,
    isLoading,
    product,
    handleBarcodeChange,
    handleQuantityChange,
    handleScanBarcode,
    handleRemoveProduct
  } = useProductRemoval();

  return (
    <RestaurantLayout hideSidebar={isMobile}>
      <div className="rtl space-y-6">
        <PageHeader title="إخراج منتج" backPath="/restaurant/mobile" />
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <BarcodeInputSection 
                barcode={barcode}
                isLoading={isLoading}
                onBarcodeChange={handleBarcodeChange}
                onScanBarcode={handleScanBarcode}
              />
              
              {product && (
                <ProductDetails 
                  product={product}
                  quantity={quantity}
                  isLoading={isLoading}
                  onQuantityChange={handleQuantityChange}
                  onRemoveProduct={handleRemoveProduct}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </RestaurantLayout>
  );
};

export default MobileRemoveProduct;
