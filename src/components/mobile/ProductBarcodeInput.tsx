
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface ProductBarcodeInputProps {
  barcode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScan: () => void;
}

const ProductBarcodeInput: React.FC<ProductBarcodeInputProps> = ({
  barcode,
  onChange,
  onScan
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="barcode">رمز الباركود</Label>
      <div className="flex gap-2">
        <Input
          id="barcode"
          placeholder="مسح أو إدخال الباركود"
          value={barcode}
          onChange={onChange}
          className="flex-1"
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onScan}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductBarcodeInput;
