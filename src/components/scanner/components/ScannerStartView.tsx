
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface ScannerStartViewProps {
  onStartScan: () => void;
}

const ScannerStartView: React.FC<ScannerStartViewProps> = ({ onStartScan }) => {
  return (
    <div className="text-center">
      <Button size="lg" onClick={onStartScan}>
        <Camera className="mr-2" />
        بدء المسح
      </Button>
    </div>
  );
};

export default ScannerStartView;
