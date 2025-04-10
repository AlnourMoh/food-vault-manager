
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScanLine } from 'lucide-react';

interface ProductBarcodeInputProps {
  onScan: () => void;
}

const ProductBarcodeInput: React.FC<ProductBarcodeInputProps> = ({
  onScan
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <Button 
        onClick={onScan}
        className="w-full bg-fvm-primary hover:bg-fvm-primary-light text-white py-3 flex items-center justify-center gap-2"
      >
        <ScanLine className="h-5 w-5" />
        <span>مسح باركود منتج</span>
      </Button>
    </div>
  );
};

export default ProductBarcodeInput;
