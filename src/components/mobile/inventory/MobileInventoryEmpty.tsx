
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileInventoryEmptyProps {
  onAddProduct: () => void;
}

const MobileInventoryEmpty: React.FC<MobileInventoryEmptyProps> = ({ onAddProduct }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Package className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium mb-2">لا توجد منتجات</h3>
      <p className="text-gray-500 mb-4">قم بإضافة منتجات جديدة للبدء</p>
      <Button 
        onClick={() => navigate('/products/add')}
        className="gap-2 mb-2"
      >
        <Plus className="h-4 w-4" />
        إضافة منتج
      </Button>
      <Button
        variant="outline"
        onClick={onAddProduct}
        className="text-sm"
      >
        تحديث المنتجات
      </Button>
    </div>
  );
};

export default MobileInventoryEmpty;
