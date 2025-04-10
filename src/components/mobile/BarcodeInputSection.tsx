
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface BarcodeInputSectionProps {
  barcode: string;
  isLoading: boolean;
  onBarcodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScanBarcode: () => void;
}

const BarcodeInputSection: React.FC<BarcodeInputSectionProps> = ({
  barcode,
  isLoading,
  onBarcodeChange,
  onScanBarcode
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="barcode">الباركود</Label>
      <div className="flex gap-2">
        <Input
          id="barcode"
          placeholder="أدخل الباركود"
          value={barcode}
          onChange={onBarcodeChange}
          className="flex-1"
        />
        <Button 
          onClick={onScanBarcode} 
          disabled={isLoading || !barcode}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "بحث"}
        </Button>
      </div>
    </div>
  );
};

export default BarcodeInputSection;
