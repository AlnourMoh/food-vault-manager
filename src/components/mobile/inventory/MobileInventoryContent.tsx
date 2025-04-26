
import React from 'react';
import { Product } from '@/types';
import MobileProductGrid from './MobileProductGrid';
import MobileInventoryEmpty from './MobileInventoryEmpty';
import { Spinner } from '@/components/ui/spinner';

interface MobileInventoryContentProps {
  products: Product[] | null;
  isLoading: boolean;
  onProductUpdate: () => void;
  filteredProducts: Product[];
}

const MobileInventoryContent: React.FC<MobileInventoryContentProps> = ({
  products,
  isLoading,
  onProductUpdate,
  filteredProducts
}) => {
  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="relative h-10 w-10">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        <p className="text-sm text-muted-foreground">جاري تحميل المنتجات...</p>
      </div>
    );
  }

  // عرض حالة عدم وجود منتجات
  if (!products || products.length === 0) {
    return <MobileInventoryEmpty onAddProduct={onProductUpdate} />;
  }

  // عرض حالة عدم وجود نتائج بحث
  if (filteredProducts.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">لا توجد منتجات تطابق البحث</p>
        <button 
          onClick={onProductUpdate}
          className="mt-2 text-primary underline text-sm"
        >
          تحديث المنتجات
        </button>
      </div>
    );
  }

  // عرض المنتجات المصفاة
  return (
    <div className="px-4 pb-4">
      <MobileProductGrid 
        products={filteredProducts}
      />
    </div>
  );
};

export default MobileInventoryContent;
