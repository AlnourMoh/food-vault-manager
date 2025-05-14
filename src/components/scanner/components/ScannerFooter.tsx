
import React from 'react';
import { Button } from '@/components/ui/button';

interface ScannerFooterProps {
  isScanning: boolean;
  onStopScan: () => void;
}

const ScannerFooter: React.FC<ScannerFooterProps> = ({ isScanning, onStopScan }) => {
  if (!isScanning) return null;
  
  return (
    <div className="p-4 flex justify-center">
      <Button variant="destructive" onClick={onStopScan}>
        إيقاف المسح
      </Button>
    </div>
  );
};

export default ScannerFooter;
