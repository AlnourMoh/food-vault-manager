
import React from 'react';
import { Package2, Clock, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EmptyProductState from '@/components/mobile/EmptyProductState';

interface InventoryProductsListProps {
  products: any[];
  loading: boolean;
  onSelectProduct: (barcode: string) => void;
}

// وظيفة مساعدة للتحقق من حالة انتهاء صلاحية المنتج
const getExpiryStatus = (expiryDate: Date | undefined) => {
  if (!expiryDate) return { status: 'unknown', label: 'غير محدد', color: 'bg-gray-100' };
  
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry <= 0) {
    return { status: 'expired', label: 'منتهي الصلاحية', color: 'bg-red-100 text-red-800 border-red-200' };
  } else if (daysUntilExpiry <= 30) {
    return { status: 'expiring-soon', label: `ينتهي خلال ${daysUntilExpiry} يوم`, color: 'bg-amber-100 text-amber-800 border-amber-200' };
  } else {
    return { status: 'valid', label: 'صالح', color: 'bg-green-100 text-green-800 border-green-200' };
  }
};

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
          {products.map((product) => {
            const expiryStatus = getExpiryStatus(product.expiryDate);
            
            return (
              <div 
                key={product.id} 
                className={`flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors ${expiryStatus.status === 'expired' ? 'border-red-300' : ''}`}
                onClick={() => onSelectProduct(product.barcode || product.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-md ${expiryStatus.status === 'expired' ? 'bg-red-100' : expiryStatus.status === 'expiring-soon' ? 'bg-amber-100' : 'bg-gray-100'}`}>
                    {expiryStatus.status === 'expired' ? (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    ) : expiryStatus.status === 'expiring-soon' ? (
                      <Clock className="h-6 w-6 text-amber-600" />
                    ) : (
                      <Package2 className="h-6 w-6 text-fvm-primary" />
                    )}
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
                        {product.expiryDate && (
                          <Badge variant="outline" className={`text-xs ${expiryStatus.color}`}>
                            {expiryStatus.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs mt-1">
                        <span className="font-medium text-green-600">الكمية المتوفرة: {product.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryProductsList;
