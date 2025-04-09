
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface InventoryHeaderProps {
  addProductPath: string;
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({ addProductPath }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold tracking-tight text-fvm-dark">المخزون</h1>
      <Button 
        onClick={() => navigate(addProductPath)} 
        className="bg-fvm-primary hover:bg-fvm-primary-light"
      >
        <Plus className="h-4 w-4 ml-2" /> إضافة منتج
      </Button>
    </div>
  );
};

export default InventoryHeader;
