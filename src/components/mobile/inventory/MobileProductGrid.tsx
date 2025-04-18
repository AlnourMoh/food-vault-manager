
import React from 'react';
import { Product } from '@/types';
import MobileProductCard from './MobileProductCard';

interface MobileProductGridProps {
  products: Product[];
}

const MobileProductGrid: React.FC<MobileProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {products.map((product) => (
        <MobileProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default MobileProductGrid;
