
import React from 'react';
import { Product } from '@/types';
import MobileProductGrid from './MobileProductGrid';
import MobileProductSkeleton from './MobileProductSkeleton';
import MobileInventoryEmpty from './MobileInventoryEmpty';

interface MobileInventoryContentProps {
  products: Product[] | undefined;
  isLoading: boolean;
  onProductUpdate: () => void;
  filteredProducts: Product[];
}

const MobileInventoryContent = ({
  products,
  isLoading,
  onProductUpdate,
  filteredProducts,
}: MobileInventoryContentProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        {[...Array(4)].map((_, index) => (
          <MobileProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return <MobileInventoryEmpty />;
  }

  return (
    <MobileProductGrid 
      products={filteredProducts} 
      onProductUpdate={onProductUpdate}
    />
  );
};

export default MobileInventoryContent;
