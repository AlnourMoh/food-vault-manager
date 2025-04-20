
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MobileCategoryTabsProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
  allLabel?: string;
}

const MobileCategoryTabs: React.FC<MobileCategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelect,
  allLabel = "الكل"
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
          {allLabel}
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

export default MobileCategoryTabs;
