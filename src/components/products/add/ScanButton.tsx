
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarcodeIcon } from 'lucide-react';

interface ScanButtonProps {
  onClick: () => void;
  isLoading: boolean;
  loadingText?: string;
  defaultText?: string;
}

export const ScanButton: React.FC<ScanButtonProps> = ({
  onClick,
  isLoading,
  loadingText = 'جاري التحقق من الأذونات...',
  defaultText = 'مسح باركود المنتج'
}) => {
  return (
    <Button 
      size="lg" 
      onClick={onClick}
      className="w-full gap-2"
      disabled={isLoading}
    >
      <BarcodeIcon className="w-5 h-5" />
      {isLoading ? loadingText : defaultText}
    </Button>
  );
};
