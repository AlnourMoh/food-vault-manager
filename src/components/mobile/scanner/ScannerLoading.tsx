
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface ScannerLoadingProps {
  onClose: () => void;
}

export const ScannerLoading: React.FC<ScannerLoadingProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
      <Spinner size="lg" className="mb-4 border-white border-t-transparent" />
      
      <p className="text-white text-lg font-medium mb-8">جاري تحضير الكاميرا...</p>
      
      <Button 
        variant="outline" 
        className="absolute bottom-10 bg-white/20 hover:bg-white/30 text-white border-white/50"
        onClick={onClose}
      >
        <X className="h-5 w-5 ml-2" />
        إلغاء
      </Button>
    </div>
  );
};
