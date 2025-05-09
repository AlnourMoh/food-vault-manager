
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface ScannerLoadingViewProps {
  onClose: () => void;
}

export const ScannerLoadingView: React.FC<ScannerLoadingViewProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
      <Spinner className="h-12 w-12 text-white" />
      <p className="text-white mt-4">جاري تجهيز الكاميرا...</p>
      <Button variant="ghost" onClick={onClose} className="mt-4 text-white">
        إلغاء
      </Button>
    </div>
  );
};
