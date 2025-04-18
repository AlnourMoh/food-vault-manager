
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileInventoryHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
      <h1 className="text-lg font-bold">المخزون</h1>
      <Button 
        size="sm"
        variant="default"
        onClick={() => navigate('/mobile/products/add')}
      >
        <Plus className="h-4 w-4 ml-1" />
        إضافة
      </Button>
    </div>
  );
};

export default MobileInventoryHeader;
