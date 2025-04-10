
import React from 'react';
import { Package2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EmptyProductState from '@/components/mobile/EmptyProductState';

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

export default InventoryProductsList;
