
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ScannerViewProps {
  onStop: () => void;
}

export const ScannerView = ({ onStop }: ScannerViewProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center">
      <div className="flex-1 w-full relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-primary rounded-lg scanner-target-frame"></div>
        </div>
        
        <div className="absolute bottom-8 inset-x-0 flex justify-center">
          <Button 
            variant="destructive" 
            size="lg" 
            className="rounded-full h-16 w-16 flex items-center justify-center"
            onClick={onStop}
          >
            <X className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};
