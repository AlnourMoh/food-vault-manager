
import React from 'react';
import { Lightbulb } from 'lucide-react';

interface ScannerFooterProps {
  isScanning: boolean;
  onStopScan: () => Promise<void>;
}

const ScannerFooter: React.FC<ScannerFooterProps> = ({ isScanning, onStopScan }) => {
  if (!isScanning) {
    return null;
  }

  return (
    <div className="p-4 flex items-center justify-center bg-black bg-opacity-50">
      <button 
        className="w-14 h-14 flex items-center justify-center rounded-full bg-white"
        onClick={onStopScan}
      >
        <Lightbulb size={24} />
      </button>
    </div>
  );
};

export default ScannerFooter;
