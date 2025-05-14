
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ScannerHeaderProps {
  onClose: () => void;
}

const ScannerHeader: React.FC<ScannerHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-4 flex justify-between items-center">
      <h2 className="text-white text-lg font-bold">مسح الباركود</h2>
      <Button variant="ghost" className="text-white" onClick={onClose}>
        <X />
      </Button>
    </div>
  );
};

export default ScannerHeader;
