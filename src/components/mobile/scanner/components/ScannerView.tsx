
import React from 'react';
import { Card } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScannerViewProps {
  onStartScan: () => Promise<void>;
  onClose: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onStartScan, onClose }) => {
  return (
    <Card className="p-6 flex flex-col items-center text-center max-w-md mx-auto">
      <div className="bg-blue-100 text-blue-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
        <Camera className="h-8 w-8" />
      </div>
      
      <h2 className="text-xl font-semibold mb-2">مسح الباركود</h2>
      <p className="text-gray-500 mb-6">
        اضغط على الزر أدناه لبدء عملية المسح
      </p>
      <div className="grid grid-cols-2 gap-2 w-full">
        <Button 
          onClick={onStartScan}
          className="w-full"
        >
          بدء المسح
        </Button>
        <Button 
          onClick={onClose} 
          variant="outline"
          className="w-full"
        >
          إغلاق
        </Button>
      </div>
    </Card>
  );
};
