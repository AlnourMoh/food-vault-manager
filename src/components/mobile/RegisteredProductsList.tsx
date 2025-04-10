
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import BarcodeButton from './BarcodeButton';
import { useRegisteredProducts, RegisteredProduct } from '@/hooks/mobile/useRegisteredProducts';

interface RegisteredProductsListProps {
  onScanProduct: (barcode: string) => void;
}

const RegisteredProductsList: React.FC<RegisteredProductsListProps> = ({ onScanProduct }) => {
  const { products, loading } = useRegisteredProducts();

  if (loading) {
    return (
      <div className="flex justify-center items-center my-6">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (products.length === 0) {
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
        <CardTitle className="text-md">المنتجات المسجلة بانتظار الإدخال</CardTitle>
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
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <h3 className="font-semibold text-sm">{product.name}</h3>
        <div className="text-xs text-gray-500 flex flex-col">
          <span>الفئة: {product.category}</span>
          <span>الوحدة: {product.unit}</span>
          <span>مسجل بواسطة: {product.addedBy}</span>
        </div>
      </div>
      <BarcodeButton onClick={onScan} buttonText="مسح" className="px-3 py-1 text-sm" />
    </div>
  );
};

export default RegisteredProductsList;
