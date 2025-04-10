
import React, { useState } from 'react';
import { BarcodeScanner as BarcodeScannerComponent } from '@/components/barcode/BarcodeScanner';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';

interface BarcodeScannerProps {
  onScanResult: (result: string) => void;
  onCancel: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScanResult,
  onCancel
}) => {
  const [manualCode, setManualCode] = useState('');

  const handleScan = (code: string) => {
    if (code && code.trim()) {
      onScanResult(code);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-100 border rounded-md p-4 w-full mb-4">
        <h3 className="text-center font-medium mb-2">مسح الباركود</h3>
        <BarcodeScannerComponent onScan={handleScan} />
      </div>
      
      <div className="flex justify-between w-full gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onCancel}
        >
          <X className="ml-2 h-4 w-4" />
          إلغاء المسح
        </Button>
        
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={() => handleScan("12345")} // For demo: simulate scanning "12345" barcode
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          محاكاة مسح منتج
        </Button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
