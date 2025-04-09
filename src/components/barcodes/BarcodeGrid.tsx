
import React from 'react';
import BarcodeCard from './BarcodeCard';
import EmptyBarcodeState from './EmptyBarcodeState';

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
  if (barcodes.length === 0) {
    return <EmptyBarcodeState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-3 barcode-grid">
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
