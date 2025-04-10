
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Package2, ScanBarcode, Clock } from 'lucide-react';
import BarcodeButton from './BarcodeButton';
import { useRegisteredProducts, RegisteredProduct } from '@/hooks/mobile/useRegisteredProducts';
import { Badge } from '@/components/ui/badge';

interface RegisteredProductsListProps {
  onScanProduct: (barcode: string) => void;
}

const RegisteredProductsList: React.FC<RegisteredProductsListProps> = ({ onScanProduct }) => {
  const { products, loading, refreshProducts } = useRegisteredProducts();

  // تنفيذ تحديث أول عند تحميل المكون
  useEffect(() => {
    console.log("تحديث المنتجات المسجلة عند تحميل المكون");
    refreshProducts();
  }, [refreshProducts]);

  // تنفيذ تحديث دوري كل 15 ثانية
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("تحديث دوري للمنتجات المسجلة");
      refreshProducts();
    }, 15000);
    
    return () => clearInterval(intervalId);
  }, [refreshProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center my-6">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <p className="text-center text-gray-500">لا توجد منتجات مسجلة حاليًا في انتظار الإدخال للمخزون</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md">المنتجات المسجلة بانتظار الإدخال ({products.length})</CardTitle>
          <button 
            onClick={refreshProducts}
            className="text-xs text-gray-500 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            تحديث
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div className="space-y-3">
          {products.map((product) => (
            <ProductItem 
              key={product.id} 
              product={product} 
              onScan={() => onScanProduct(product.barcode || product.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface ProductItemProps {
  product: RegisteredProduct;
  onScan: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onScan }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
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
            <div className="flex items-center gap-1 mt-1">
              <span>سجل بواسطة: </span>
              <span className="font-semibold">{product.addedBy}</span>
              {product.createdAt && (
                <span className="text-gray-400 mr-1">({product.createdAt})</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <BarcodeButton 
        onClick={onScan} 
        buttonText={
          <div className="flex items-center gap-1">
            <ScanBarcode className="h-4 w-4" />
            <span>مسح باركود</span>
          </div>
        } 
        className="px-3 py-1 text-sm"
      />
    </div>
  );
};

export default RegisteredProductsList;
