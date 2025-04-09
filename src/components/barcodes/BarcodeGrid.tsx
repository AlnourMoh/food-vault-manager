
import React from 'react';
import BarcodeCard from './BarcodeCard';
import EmptyBarcodeState from './EmptyBarcodeState';
import { useIsMobile } from '@/hooks/use-mobile';

interface BarcodeGridProps {
  barcodes: Array<{
    id: string;
    product_id: string;
    qr_code: string;
    is_used: boolean;
  }>;
  productName: string;
  onPrintSingle?: (barcodeId: string) => void;
}

const BarcodeGrid: React.FC<BarcodeGridProps> = ({ 
  barcodes, 
  productName,
  onPrintSingle 
}) => {
  const isMobile = useIsMobile();
  
  if (barcodes.length === 0) {
    return <EmptyBarcodeState />;
  }

  // Set column count based on screen size for print preview
  const getColumnClass = () => {
    if (isMobile) {
      return "grid-cols-1";
    }
    
    // For different screen sizes in responsive design
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
  };

  return (
    <div className={`grid ${getColumnClass()} gap-4 print:grid-cols-3 barcode-grid`}>
      {barcodes.map((barcode) => (
        <BarcodeCard 
          key={barcode.id} 
          barcode={barcode} 
          productName={productName} 
          onPrintSingle={onPrintSingle}
        />
      ))}
    </div>
  );
};

export default BarcodeGrid;
