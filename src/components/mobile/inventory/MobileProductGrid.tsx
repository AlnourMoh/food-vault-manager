
import React, { useState, useMemo } from 'react';
import { Product } from '@/types';
import { differenceInDays } from 'date-fns';
import MobileProductCard from './MobileProductCard';
import MobileProductDetailsDialog from './MobileProductDetailsDialog';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface MobileProductGridProps {
  products: Product[];
  onProductUpdate: () => void;
}

const MobileProductGrid: React.FC<MobileProductGridProps> = ({ products, onProductUpdate }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [productToRemove, setProductToRemove] = useState<Product | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // ترتيب المنتجات حسب حالة انتهاء الصلاحية
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const daysUntilExpiryA = differenceInDays(new Date(a.expiryDate), new Date());
      const daysUntilExpiryB = differenceInDays(new Date(b.expiryDate), new Date());
      
      // إذا كان كلا المنتجين منتهيي الصلاحية، رتب حسب الأحدث انتهاءً
      if (daysUntilExpiryA < 0 && daysUntilExpiryB < 0) {
        return daysUntilExpiryA - daysUntilExpiryB;
      }
      
      // إذا كان كلا المنتجين قريبين من انتهاء الصلاحية (خلال 30 يومًا)، رتب حسب الأقرب للانتهاء
      if (daysUntilExpiryA <= 30 && daysUntilExpiryB <= 30) {
        return daysUntilExpiryA - daysUntilExpiryB;
      }
      
      // إذا كان أحدهما منتهي الصلاحية والآخر ليس كذلك، المنتهي يأتي أولاً
      if (daysUntilExpiryA < 0) return -1;
      if (daysUntilExpiryB < 0) return 1;
      
      // إذا كان أحدهما قريبًا من انتهاء الصلاحية والآخر ليس كذلك، القريب يأتي أولاً
      if (daysUntilExpiryA <= 30) return -1;
      if (daysUntilExpiryB <= 30) return 1;
      
      // بالنسبة لجميع المنتجات الأخرى، رتب حسب تاريخ انتهاء الصلاحية
      return daysUntilExpiryA - daysUntilExpiryB;
    });
  }, [products]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleScanProduct = (product: Product) => {
    console.log('فتح الماسح الضوئي للمنتج:', product.name);
    // بدلاً من إعداد productToRemove، سنفتح صفحة مسح منتج جديدة
    navigate('/scan-product');
  };

  const handleScanComplete = async (code: string) => {
    try {
      // معالجة نتيجة المسح
      console.log('تم المسح بنجاح:', code);
      
      toast({
        title: "تم المسح بنجاح",
        description: `تم مسح الباركود: ${code}`,
      });
      
      // إغلاق الماسح وتنظيف الحالة
      handleScannerClose();
      
      // إخطار الواجهة العليا بالتحديث
      onProductUpdate();
    } catch (error) {
      console.error('Error processing scan:', error);
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء معالجة نتيجة المسح",
        variant: "destructive"
      });
      
      // تنظيف حالة التطبيق في حالة الخطأ أيضًا
      handleScannerClose();
    }
  };

  const handleScannerClose = () => {
    console.log('إغلاق الماسح');
    
    // استخدام timeout قصير جدًا لتجنب مشاكل التزامن مع إغلاق الماسح وإعادة تهيئة الحالة
    setTimeout(() => {
      setIsScannerOpen(false);
      setProductToRemove(null);
    }, 10);
  };

  return (
    <>
      <div className="w-full px-0 mx-0">
        {sortedProducts.map((product) => (
          <div key={product.id} className="w-full mb-3 px-0">
            <MobileProductCard 
              product={product}
              onSelect={handleProductSelect}
              onScan={handleScanProduct} // تغيير اسم الدالة لتكون أكثر وضوحاً
            />
          </div>
        ))}
      </div>

      <MobileProductDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        onProductUpdate={onProductUpdate}
      />

      {isScannerOpen && (
        <BarcodeScanner
          onScan={handleScanComplete}
          onClose={handleScannerClose}
        />
      )}
    </>
  );
};

export default MobileProductGrid;
