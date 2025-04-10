
import React from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useProductRemoval } from '@/hooks/mobile/useProductRemoval';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import PageHeader from '@/components/mobile/PageHeader';
import ProductInfo from '@/components/mobile/ProductInfo';
import ProductSubmitButton from '@/components/mobile/ProductSubmitButton';
import EmptyProductState from '@/components/mobile/EmptyProductState';
import { Button } from '@/components/ui/button';
import { ScanLine, Package2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInventoryProducts } from '@/hooks/mobile/useInventoryProducts';

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

  const { products, loading: productsLoading } = useInventoryProducts();

  // تابع لاختيار منتج من القائمة
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
              <>
                <InventoryProductsList 
                  products={products} 
                  loading={productsLoading} 
                  onSelectProduct={handleSelectProduct} 
                />
              </>
            )}
          </>
        )}
      </div>
    </RestaurantLayout>
  );
};

// مكون لعرض قائمة المنتجات المتوفرة في المخزون
interface InventoryProductsListProps {
  products: any[];
  loading: boolean;
  onSelectProduct: (barcode: string) => void;
}

const InventoryProductsList: React.FC<InventoryProductsListProps> = ({ 
  products, 
  loading, 
  onSelectProduct 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center my-6">
        <div className="animate-spin w-8 h-8 border-4 border-fvm-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyProductState />;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">المنتجات المتوفرة في المخزون ({products.length})</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div className="space-y-3">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSelectProduct(product.barcode || product.id)}
            >
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-md">
                  <Package2 className="h-6 w-6 text-fvm-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{product.name}</h3>
                  <div className="text-xs text-gray-500 mt-1 space-y-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        {product.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        {product.unit}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs mt-1">
                      <span className="font-medium text-green-600">الكمية المتوفرة: {product.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileRemoveProduct;
