
import React from 'react';
import { Card } from '@/components/ui/card';
import { Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingViewProps {
  hasPermission: boolean | null;
  scanActive: boolean;
  onClose: () => void;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ hasPermission, scanActive, onClose }) => {
  return (
    <Card className="p-6 flex flex-col items-center text-center max-w-md mx-auto">
      <div className="flex justify-center items-center mb-4">
        <Scan className="h-16 w-16 text-blue-500 animate-pulse" />
      </div>
      <h2 className="text-xl font-semibold mb-2">
        {hasPermission === null ? "جاري التحقق من الأذونات..." : "جاري المسح..."}
      </h2>
      <p className="text-gray-500 mb-6">
        {scanActive ? "وجه الكاميرا نحو الباركود" : "يرجى الانتظار..."}
      </p>
      <Button 
        onClick={onClose} 
        variant="outline"
        className="w-full"
      >
        إلغاء
      </Button>
    </Card>
  );
};
