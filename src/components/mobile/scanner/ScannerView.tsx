
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ScannerViewProps {
  onStop: () => void;
}

export const ScannerView = ({ onStop }: ScannerViewProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center bg-black bg-opacity-50">
      <div className="flex-1 w-full relative flex items-center justify-center">
        <div className="w-72 h-72 border-4 border-primary rounded-lg scanner-target-frame flex items-center justify-center">
          <div className="text-white text-center px-4">
            <p className="mb-2 font-bold">قم بتوجيه الكاميرا نحو الباركود</p>
            <p className="text-sm opacity-80">يتم المسح تلقائيًا عند اكتشاف رمز</p>
          </div>
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
