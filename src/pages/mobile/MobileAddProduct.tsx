
import React from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useProductAddition } from '@/hooks/mobile/useProductAddition';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import PageHeader from '@/components/mobile/PageHeader';
import ProductInfo from '@/components/mobile/ProductInfo';
import ProductSubmitButton from '@/components/mobile/ProductSubmitButton';
import RegisteredProductsList from '@/components/mobile/RegisteredProductsList';
import { Button } from '@/components/ui/button';
import { ScanLine } from 'lucide-react';

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

  // Handle quantity change event
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  };

  // Handle selecting a product from the registered products list
  const handleSelectProduct = (productBarcode: string) => {
    handleScanResult(productBarcode);
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
                  action="إضافة"
                />
                
                <ProductSubmitButton 
                  onClick={handleAddProduct}
                  disabled={loading}
                  label="تأكيد إدخال المنتج"
                />
              </>
            ) : (
              // Display registered products list waiting for input
              <RegisteredProductsList onScanProduct={handleSelectProduct} />
            )}
          </>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default MobileAddProduct;
