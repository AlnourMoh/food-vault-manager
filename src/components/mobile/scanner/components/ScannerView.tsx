
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ScannerViewProps {
  onStartScan: () => Promise<boolean>;
  onClose: () => void;
  onManualEntry?: () => void; // Added optional onManualEntry prop
}

export const ScannerView: React.FC<ScannerViewProps> = ({ 
  onStartScan, 
  onClose, 
  onManualEntry 
}) => {
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
        
        {/* Add manual entry button if the prop is provided */}
        {onManualEntry && (
          <Button
            onClick={onManualEntry}
            variant="outline"
            className="w-full text-white border-white/30 hover:bg-white/10"
          >
            إدخال الرمز يدوياً
          </Button>
        )}
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
