
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ScannerLoadingProps {
  onClose: () => void;
}

export const ScannerLoading: React.FC<ScannerLoadingProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
      <div className="relative w-16 h-16 mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-t-white border-l-white border-r-transparent border-b-transparent animate-spin"></div>
      </div>
      
      <p className="text-white text-lg font-medium mb-8">جاري تحضير الماسح الضوئي...</p>
      
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
