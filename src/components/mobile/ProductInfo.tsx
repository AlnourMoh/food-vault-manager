
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { AlertCircle, Clock, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductInfoProps {
  productInfo: any;
  quantity: string;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  action?: string;
  showMaxQuantity?: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  productInfo,
  quantity,
  onQuantityChange,
  action = "إضافة",
  showMaxQuantity = false
}) => {
  if (!productInfo) return null;

  // التحقق من حالة انتهاء الصلاحية
  const getExpiryStatus = () => {
    if (!productInfo.expiryDate) return { status: 'unknown', label: '', color: '' };
    
    const today = new Date();
    const expiry = new Date(productInfo.expiryDate.toDate ? productInfo.expiryDate.toDate() : productInfo.expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 0) {
      return { 
        status: 'expired', 
        label: 'منتهي الصلاحية!', 
        color: 'text-red-600', 
        icon: <AlertCircle className="h-4 w-4 text-red-600 inline mr-1" />
      };
    } else if (daysUntilExpiry <= 30) {
      return { 
        status: 'expiring-soon', 
        label: `ينتهي خلال ${daysUntilExpiry} يوم`, 
        color: 'text-amber-600',
        icon: <Clock className="h-4 w-4 text-amber-600 inline mr-1" />
      };
    }
    
    return { status: 'valid', label: '', color: '', icon: null };
  };

  // التحقق من حالة المخزون
  const getStockStatus = () => {
    if (productInfo.quantity === undefined) return { status: 'unknown', label: '', color: '' };
    
    if (productInfo.quantity < 5) {
      return {
        status: 'low',
        label: 'مخزون منخفض!',
        color: 'text-blue-600',
        icon: <Bell className="h-4 w-4 text-blue-600 inline mr-1" />
      };
    }
    
    return { status: 'good', label: '', color: '', icon: null };
  };

  const expiryStatus = getExpiryStatus();
  const stockStatus = getStockStatus();
  const hasWarnings = expiryStatus.status !== 'valid' || stockStatus.status === 'low';

  return (
    <>
      <Separator />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">معلومات المنتج:</h3>
          {hasWarnings && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
              يحتاج للانتباه
            </Badge>
          )}
        </div>
        <p className="text-sm">الاسم: {productInfo.name}</p>
        <p className="text-sm">الوصف: {productInfo.description || 'غير متوفر'}</p>
        <p className={`text-sm ${expiryStatus.color}`}>
          تاريخ الانتهاء: {productInfo.expiryDate ? 
            <>
              {expiryStatus.icon}
              {format(new Date(productInfo.expiryDate.toDate ? productInfo.expiryDate.toDate() : productInfo.expiryDate), 'PPP', { locale: ar })}
              {expiryStatus.status !== 'valid' && ` (${expiryStatus.label})`}
            </> : 
            'غير محدد'
          }
        </p>
        {showMaxQuantity && (
          <p className={`text-sm font-medium ${stockStatus.color}`}>
            {stockStatus.icon}
            الكمية المتوفرة: {productInfo.quantity || 0}
            {stockStatus.status === 'low' && ` (${stockStatus.label})`}
          </p>
        )}
      </div>
      <Separator />
      <div className="flex flex-col space-y-2">
        <Label htmlFor="quantity">الكمية</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={onQuantityChange}
        />
      </div>
    </>
  );
};

export default ProductInfo;
