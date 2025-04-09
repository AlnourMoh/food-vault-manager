
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';

interface EmptyInventoryProps {
  addProductPath: string;
}

const EmptyInventory: React.FC<EmptyInventoryProps> = ({ addProductPath }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-medium">لا توجد منتجات في المخزون</h3>
      <p className="text-gray-500 mt-2 mb-6">قم بإضافة منتجات جديدة للبدء</p>
      <Button 
        onClick={() => navigate(addProductPath)} 
        className="bg-fvm-primary hover:bg-fvm-primary-light"
      >
        <Plus className="h-4 w-4 ml-2" /> إضافة منتج جديد
      </Button>
    </div>
  );
};

export default EmptyInventory;
