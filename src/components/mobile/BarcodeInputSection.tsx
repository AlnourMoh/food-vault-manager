
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ScanLine } from 'lucide-react';

interface BarcodeInputSectionProps {
  isLoading: boolean;
  onScanBarcode: () => void;
}

const BarcodeInputSection: React.FC<BarcodeInputSectionProps> = ({
  isLoading,
  onScanBarcode
}) => {
  return (
    <div className="space-y-2">
      <Button 
        onClick={onScanBarcode} 
        disabled={isLoading}
        className="w-full bg-fvm-primary hover:bg-fvm-primary-light text-white py-3 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <ScanLine className="h-5 w-5" />
            <span>مسح باركود منتج</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default BarcodeInputSection;
