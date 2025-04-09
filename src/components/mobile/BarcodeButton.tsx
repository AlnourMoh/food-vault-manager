
import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

interface BarcodeButtonProps {
  onClick: () => void;
  buttonText: string;
  className?: string;
}

const BarcodeButton: React.FC<BarcodeButtonProps> = ({ 
  onClick, 
  buttonText,
  className = ""
}) => {
  return (
    <Button 
      onClick={onClick}
      className={`flex items-center gap-2 bg-fvm-primary hover:bg-fvm-primary-light ${className}`}
    >
      <QrCode className="h-4 w-4" />
      <span>{buttonText}</span>
    </Button>
  );
};

export default BarcodeButton;
