
import React from 'react';
import { Package2, Clock, AlertCircle, Bell, ScanBarcode } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EmptyProductState from '@/components/mobile/EmptyProductState';

interface InventoryProductsListProps {
  products: any[];
  loading: boolean;
  onSelectProduct: (barcode: string) => void;
  showNotificationBadge?: boolean;
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

// A function to check if a product needs attention (low stock, about to expire, etc.)
const needsAttention = (product: any) => {
  if (!product) return false;
  
  // Low stock check
  if (product.quantity < 5) return true;
  
  // Expiry check
  if (product.expiryDate) {
    const expiryStatus = getExpiryStatus(product.expiryDate);
    if (expiryStatus.status === 'expired' || expiryStatus.status === 'expiring-soon') {
      return true;
    }
  }
  
  return false;
};

const InventoryProductsList: React.FC<InventoryProductsListProps> = ({ 
  products, 
  loading, 
  onSelectProduct,
  showNotificationBadge = false
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
        <CardTitle className="text-md flex items-center justify-between">
          <span>المنتجات المتوفرة في المخزون ({products.length})</span>
          {showNotificationBadge && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
              <Bell className="h-3 w-3" /> المنتجات تحتاج للانتباه
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div className="space-y-3">
          {products.map((product) => {
            const expiryStatus = getExpiryStatus(product.expiryDate);
            const attention = needsAttention(product);
            
            return (
              <div 
                key={product.id} 
                className={`flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors ${
                  attention ? 'border-amber-300 shadow-sm' : 
                  expiryStatus.status === 'expired' ? 'border-red-300' : ''
                }`}
              >
                <div 
                  className="flex items-start gap-3 flex-1 cursor-pointer"
                  onClick={() => onSelectProduct(product.barcode || product.id)}
                >
                  <div className={`p-2 rounded-md ${
                    expiryStatus.status === 'expired' ? 'bg-red-100' : 
                    expiryStatus.status === 'expiring-soon' ? 'bg-amber-100' : 
                    product.quantity < 5 ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {expiryStatus.status === 'expired' ? (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    ) : expiryStatus.status === 'expiring-soon' ? (
                      <Clock className="h-6 w-6 text-amber-600" />
                    ) : product.quantity < 5 ? (
                      <Bell className="h-6 w-6 text-blue-600" />
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
                        {product.quantity < 5 && (
                          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                            مخزون منخفض
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs mt-1">
                        <span className={`font-medium ${product.quantity < 5 ? 'text-blue-600' : 'text-green-600'}`}>
                          الكمية المتوفرة: {product.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* زر مسح الباركود */}
                <Button 
                  variant="outline" 
                  size="icon"
                  className="flex-shrink-0 border-fvm-primary text-fvm-primary hover:bg-fvm-primary-light hover:text-white"
                  onClick={() => onSelectProduct(product.barcode || product.id)}
                >
                  <ScanBarcode className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryProductsList;
