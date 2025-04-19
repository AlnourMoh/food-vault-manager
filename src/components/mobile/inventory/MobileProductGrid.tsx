
import React, { useState } from 'react';
import { Product } from '@/types';
import MobileProductCard from './MobileProductCard';
import MobileProductDetailsDialog from './MobileProductDetailsDialog';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';

interface MobileProductGridProps {
  products: Product[];
  onProductUpdate: () => void;
}

const MobileProductGrid: React.FC<MobileProductGridProps> = ({ products, onProductUpdate }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [productToRemove, setProductToRemove] = useState<Product | null>(null);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleRemoveProduct = (product: Product) => {
    setProductToRemove(product);
    setIsScannerOpen(true);
  };

  const handleScanComplete = async (code: string) => {
    // Here you would implement the logic to validate the scanned code
    // and process the product removal
    console.log('Scanned code:', code);
    setIsScannerOpen(false);
    setProductToRemove(null);
    onProductUpdate();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto px-4">
        {products.map((product) => (
          <div key={product.id}>
            <MobileProductCard 
              product={product}
              onSelect={handleProductSelect}
              onRemove={handleRemoveProduct}
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

      {isScannerOpen && (
        <BarcodeScanner
          onScan={handleScanComplete}
          onClose={() => {
            setIsScannerOpen(false);
            setProductToRemove(null);
          }}
        />
      )}
    </>
  );
};

export default MobileProductGrid;
