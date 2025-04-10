
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { AlertCircle, Clock } from 'lucide-react';

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

  const expiryStatus = getExpiryStatus();

  return (
    <>
      <Separator />
      <div className="space-y-2">
        <h3 className="font-medium">معلومات المنتج:</h3>
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
          <p className="text-sm font-medium">
            الكمية المتوفرة: {productInfo.quantity || 0}
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
