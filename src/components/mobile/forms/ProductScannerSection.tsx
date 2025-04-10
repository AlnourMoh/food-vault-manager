
import React from 'react';
import { Button } from '@/components/ui/button';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';

interface ProductScannerSectionProps {
  isScanning: boolean;
  setScanning: (value: boolean) => void;
  handleScanResult: (result: string) => void;
}

const ProductScannerSection: React.FC<ProductScannerSectionProps> = ({
  isScanning,
  setScanning,
  handleScanResult
}) => {
  return (
    <>
      {isScanning ? (
        <BarcodeScanner 
          onScanResult={handleScanResult}
          onCancel={() => setScanning(false)}
        />
      ) : (
        <Button 
          className="w-full bg-fvm-primary hover:bg-fvm-primary-light text-white py-3 flex items-center justify-center gap-2"
          onClick={() => setScanning(true)}
        >
          <span>مسح باركود منتج</span>
        </Button>
      )}
    </>
  );
};

export default ProductScannerSection;
