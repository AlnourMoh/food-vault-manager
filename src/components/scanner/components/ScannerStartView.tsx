
import React from 'react';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScannerStartViewProps {
  onStartScan: () => void;
}

const ScannerStartView: React.FC<ScannerStartViewProps> = ({ onStartScan }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-black bg-opacity-80 h-full">
      <div className="w-24 h-24 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
        <QrCode className="w-12 h-12 text-primary" />
      </div>
      
      <h2 className="text-white text-2xl font-bold">قارئ الباركود</h2>
      <p className="text-white text-opacity-70 text-center max-w-xs">
        قم بالضغط على زر المسح أدناه لبدء عملية مسح الباركود.
      </p>
      
      <Button onClick={onStartScan} className="mt-4" size="lg">
        بدء المسح
      </Button>
    </div>
  );
};

export default ScannerStartView;
