
import React from 'react';
import { BarcodeScanner as BarcodeScannerComponent } from '@/components/barcode/BarcodeScanner';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface BarcodeScannerProps {
  onScanResult: (result: string) => void;
  onCancel: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScanResult,
  onCancel
}) => {
  return (
    <div className="flex flex-col items-center">
      <BarcodeScannerComponent onScan={onScanResult} />
      <Button 
        variant="outline" 
        className="mt-4" 
        onClick={onCancel}
      >
        <X className="mr-2 h-4 w-4" />
        إلغاء المسح
      </Button>
    </div>
  );
};

export default BarcodeScanner;
