
import React from 'react';
import { Button } from '@/components/ui/button';
import { Flashlight, Keyboard } from 'lucide-react';

interface ScannerControlsProps {
  onToggleFlash: () => void;
  onManualEntry: () => void;
}

export const ScannerControls = ({ onToggleFlash, onManualEntry }: ScannerControlsProps) => {
  return (
    <>
      <div className="absolute top-24 inset-x-0 flex justify-center">
        <Button 
          variant="outline"
          size="icon" 
          className="rounded-full h-12 w-12 bg-background/20 hover:bg-background/40"
          onClick={onToggleFlash}
        >
          <Flashlight className="h-6 w-6 text-white" />
        </Button>
      </div>
      
      <div className="absolute bottom-24 inset-x-0 flex justify-center">
        <Button 
          variant="secondary"
          size="lg" 
          className="rounded-full px-6"
          onClick={onManualEntry}
        >
          <Keyboard className="h-5 w-5 ml-2" />
          إدخال الكود يدويًا
        </Button>
      </div>
    </>
  );
};

