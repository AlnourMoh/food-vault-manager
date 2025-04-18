
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileInventorySearch from './MobileInventorySearch';
import MobileCategoryFilter from './MobileCategoryFilter';

interface MobileInventoryHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const MobileInventoryHeader: React.FC<MobileInventoryHeaderProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const navigate = useNavigate();
  console.log('MobileInventoryHeader rendering with categories:', categories);
  
  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      <div className="p-4 flex items-center justify-between">
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
      
      <div className="px-4 pb-2">
        <MobileInventorySearch 
          value={searchQuery} 
          onChange={onSearchChange} 
        />
      </div>
      
      <MobileCategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={onCategorySelect}
      />
    </div>
  );
};

export default MobileInventoryHeader;
