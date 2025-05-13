
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ScannerViewProps {
  onStartScan: () => Promise<boolean>;
  onClose: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onStartScan, onClose }) => {
  const handleScan = async () => {
    try {
      await onStartScan();
    } catch (error) {
      console.error('Error starting scan:', error);
    }
  };

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden relative">
      <div className="p-4 flex flex-col items-center">
        <Button
          onClick={handleScan}
          className="w-full mb-2"
        >
          بدء المسح الضوئي
        </Button>
      </div>
      
      <Button
        onClick={onClose}
        className="absolute top-2 right-2 p-1"
        variant="ghost"
        size="icon"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
