
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MobileCategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

const MobileCategoryFilter: React.FC<MobileCategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelect 
}) => {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 p-2 overflow-x-auto">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(null)}
          className="whitespace-nowrap"
        >
          الكل
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MobileCategoryFilter;
