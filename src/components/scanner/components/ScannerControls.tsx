
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, RefreshCw } from 'lucide-react';

interface ScannerControlsProps {
  onClose: () => void;
  onRefresh?: () => void;
  isActive?: boolean;
}

const ScannerControls: React.FC<ScannerControlsProps> = ({ 
  onClose, 
  onRefresh, 
  isActive = true 
}) => {
  return (
    <div className="bg-black w-full p-4 flex justify-between items-center">
      <Button
        onClick={onClose}
        variant="ghost"
        className="text-white hover:text-gray-300"
      >
        <X className="h-5 w-5 mr-2" />
        إلغاء
      </Button>
      
      <Button
        onClick={onRefresh}
        variant="ghost"
        className={`${isActive ? 'bg-white' : 'bg-gray-600'} text-black rounded-full w-12 h-12 flex items-center justify-center`}
        disabled={!isActive}
      >
        {isActive ? (
          <Camera className="h-5 w-5" />
        ) : (
          <RefreshCw className="h-5 w-5 animate-spin" />
        )}
      </Button>
      
      <div className="w-16"></div>
    </div>
  );
};

export default ScannerControls;
