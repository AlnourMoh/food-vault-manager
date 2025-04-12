
import React from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useProductAddition } from '@/hooks/mobile/useProductAddition';
import { useInventoryProducts } from '@/hooks/mobile/useInventoryProducts';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import PageHeader from '@/components/mobile/PageHeader';
import ProductInfo from '@/components/mobile/ProductInfo';
import ProductSubmitButton from '@/components/mobile/ProductSubmitButton';
import RegisteredProductsList from '@/components/mobile/RegisteredProductsList';
import InventoryProductsList from '@/components/mobile/forms/InventoryProductsList';
import { Button } from '@/components/ui/button';
import { ScanLine, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  // Fetch inventory products to show low stock items
  const { products: inventoryProducts, loading: inventoryLoading } = useInventoryProducts();
  
  // Filter products that need attention (low stock)
  const productsNeedingAttention = inventoryProducts.filter(product => product.quantity < 5);

  // Handle quantity change event
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  };

  // Handle selecting a product from the registered products list
  const handleSelectProduct = (productBarcode: string) => {
    handleScanResult(productBarcode);
  };

  // Handle selecting a product from the inventory list
  const handleSelectInventoryProduct = (productBarcode: string) => {
    handleScanResult(productBarcode);
  };
  
  // تابع لفتح الماسح الضوئي مباشرة
  const handleScanButtonClick = () => {
    setScanning(true);
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
              <>
                {/* Display products that need attention (low stock) */}
                {productsNeedingAttention.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <h2 className="text-lg font-medium">منتجات تحتاج للإدخال</h2>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        {productsNeedingAttention.length}
                      </Badge>
                    </div>
                    <InventoryProductsList 
                      products={productsNeedingAttention}
                      loading={inventoryLoading}
                      onSelectProduct={handleSelectInventoryProduct}
                      onScanButtonClick={handleScanButtonClick}
                      showNotificationBadge={true}
                    />
                  </div>
                )}
                
                {/* Display registered products list waiting for input */}
                <RegisteredProductsList onScanProduct={handleSelectProduct} />
              </>
            )}
          </>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default MobileAddProduct;
