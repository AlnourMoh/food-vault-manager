
import React, { useState } from 'react';
import { Product } from '@/types';
import MobileProductCard from './MobileProductCard';
import MobileProductDetailsDialog from './MobileProductDetailsDialog';

interface MobileProductGridProps {
  products: Product[];
  onProductUpdate: () => void;
}

const MobileProductGrid: React.FC<MobileProductGridProps> = ({ products, onProductUpdate }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-4">
        {products.map((product) => (
          <MobileProductCard 
            key={product.id} 
            product={product}
            onSelect={handleProductSelect}
          />
        ))}
      </div>

      <MobileProductDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        onProductUpdate={onProductUpdate}
      />
    </>
  );
};

export default MobileProductGrid;
