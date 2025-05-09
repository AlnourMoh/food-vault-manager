
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface ScanButtonProps {
  onClick: () => Promise<void>; 
  isLoading: boolean;
  loadingText?: string;
  defaultText?: string;
}

export const ScanButton: React.FC<ScanButtonProps> = ({
  onClick,
  isLoading,
  loadingText = 'جاري فتح الكاميرا...',
  defaultText = 'فتح كاميرا المنتج'
}) => {
  return (
    <Button 
      size="lg" 
      onClick={onClick}
      className="w-full gap-2"
      disabled={isLoading}
    >
      <Camera className="w-5 h-5" />
      {isLoading ? loadingText : defaultText}
    </Button>
  );
};
