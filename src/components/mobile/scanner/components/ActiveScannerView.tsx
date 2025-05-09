
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ActiveScannerViewProps {
  cameraActive: boolean;
  onClose: () => void;
}

export const ActiveScannerView: React.FC<ActiveScannerViewProps> = ({ cameraActive, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="relative flex-1 w-full">
        {/* Scanner content would go here */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-white/70 rounded-lg"></div>
        </div>
      </div>
      
      {/* Control bar */}
      <div className="bg-black/90 p-4 flex justify-center">
        <Button 
          onClick={onClose} 
          variant="outline" 
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <X className="h-4 w-4 mr-2" />
          إغلاق
        </Button>
      </div>
    </div>
  );
};
