
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const RestaurantsHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">المطاعم</h1>
      <Button 
        className="bg-fvm-primary hover:bg-fvm-primary-light flex items-center gap-2"
        onClick={() => navigate('/restaurants/add')}
      >
        <Plus className="h-4 w-4" />
        <span>إضافة مطعم جديد</span>
      </Button>
    </div>
  );
};

export default RestaurantsHeader;
