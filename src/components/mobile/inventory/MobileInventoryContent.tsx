
import React from 'react';
import MobileProductCard from './MobileProductCard';
import MobileProductSkeleton from './MobileProductSkeleton';
import MobileInventoryEmpty from './MobileInventoryEmpty';
import MobileProductDetailsDialog from './MobileProductDetailsDialog';
import { Product } from '@/types';
import { useNavigate } from 'react-router-dom';

interface MobileInventoryContentProps {
  products: Product[] | undefined;
  filteredProducts: Product[] | undefined;
  isLoading: boolean;
  onProductUpdate: () => void;
  onScan?: (product: Product) => void;
}

const MobileInventoryContent: React.FC<MobileInventoryContentProps> = ({
  products,
  filteredProducts,
  isLoading,
  onProductUpdate,
  onScan
}) => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const navigate = useNavigate();

  // تحديد المنتجات التي سيتم عرضها (إما المصفاة أو الكل)
  const displayedProducts = filteredProducts || products || [];

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  const handleScanProduct = (product: Product) => {
    if (onScan) {
      onScan(product);
    } else {
      navigate('/scan');
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {Array(4).fill(0).map((_, index) => (
          <MobileProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!displayedProducts.length) {
    return <MobileInventoryEmpty onAddProduct={onProductUpdate} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4">
        {displayedProducts.map((product) => (
          <MobileProductCard
            key={product.id}
            product={product}
            onSelect={handleProductSelect}
            onScan={handleScanProduct}
          />
        ))}
      </div>

      {selectedProduct && (
        <MobileProductDetailsDialog
          open={!!selectedProduct}
          onOpenChange={handleCloseDialog}
          product={selectedProduct}
          onProductUpdate={onProductUpdate}
        />
      )}
    </>
  );
};

export default MobileInventoryContent;
