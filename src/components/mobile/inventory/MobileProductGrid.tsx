
import React, { useState, useMemo } from 'react';
import { Product } from '@/types';
import { differenceInDays } from 'date-fns';
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

  // Sort products by expiry status
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const daysUntilExpiryA = differenceInDays(new Date(a.expiryDate), new Date());
      const daysUntilExpiryB = differenceInDays(new Date(b.expiryDate), new Date());
      
      // If both products are expired, sort by most recently expired
      if (daysUntilExpiryA < 0 && daysUntilExpiryB < 0) {
        return daysUntilExpiryA - daysUntilExpiryB;
      }
      
      // If both products are near expiry (within 30 days), sort by closest to expiry
      if (daysUntilExpiryA <= 30 && daysUntilExpiryB <= 30) {
        return daysUntilExpiryA - daysUntilExpiryB;
      }
      
      // If one is expired and one isn't, expired goes first
      if (daysUntilExpiryA < 0) return -1;
      if (daysUntilExpiryB < 0) return 1;
      
      // If one is near expiry and one isn't, near expiry goes first
      if (daysUntilExpiryA <= 30) return -1;
      if (daysUntilExpiryB <= 30) return 1;
      
      // For all other products, sort by expiry date
      return daysUntilExpiryA - daysUntilExpiryB;
    });
  }, [products]);

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
      <div className="w-full px-0">
        {sortedProducts.map((product) => (
          <div key={product.id} className="w-full mb-3">
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
