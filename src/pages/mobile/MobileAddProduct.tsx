
import React from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import useDeviceDetection from '@/hooks/useDeviceDetection';
import { Card, CardContent } from '@/components/ui/card';
import { useProductAddition } from '@/hooks/mobile/useProductAddition';
import PageHeader from '@/components/mobile/PageHeader';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import ProductBarcodeInput from '@/components/mobile/ProductBarcodeInput';
import ProductInfo from '@/components/mobile/ProductInfo';
import ProductSubmitButton from '@/components/mobile/ProductSubmitButton';
import EmptyProductState from '@/components/mobile/EmptyProductState';

const MobileAddProduct = () => {
  const { isMobile } = useDeviceDetection();
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

  return (
    <RestaurantLayout hideSidebar={isMobile}>
      <div className="rtl space-y-6">
        <PageHeader title="إدخال منتج" backPath="/restaurant/mobile" />
        
        {scanning ? (
          <BarcodeScanner 
            onScanResult={handleScanResult} 
            onCancel={() => setScanning(false)} 
          />
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <ProductBarcodeInput 
                    barcode={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onScan={() => setScanning(true)}
                  />

                  <ProductInfo 
                    productInfo={productInfo}
                    quantity={quantity}
                    onQuantityChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {productInfo && (
              <ProductSubmitButton 
                onClick={handleAddProduct} 
                disabled={loading} 
              />
            )}

            {!barcode && <EmptyProductState />}
          </div>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default MobileAddProduct;
