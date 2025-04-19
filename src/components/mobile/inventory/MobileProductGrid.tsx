
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
      <div className="flex flex-col gap-4 px-4 pb-4">
        {products.map((product) => (
          <div key={product.id} className="w-full">
            <MobileProductCard 
              product={product}
              onSelect={handleProductSelect}
            />
          </div>
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
