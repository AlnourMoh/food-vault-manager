
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScannerErrorViewProps {
  onRetry: () => void;
  onClose: () => void;
}

const ScannerErrorView: React.FC<ScannerErrorViewProps> = ({ onRetry, onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center bg-black bg-opacity-80 absolute inset-0">
      <div className="w-16 h-16 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      
      <h3 className="text-white text-xl font-bold">حدث خطأ</h3>
      
      <p className="text-white text-opacity-80">
        تعذر تشغيل الماسح الضوئي. يرجى التحقق من إذن الكاميرا والمحاولة مرة أخرى.
      </p>
      
      <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
        <Button onClick={onRetry} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          إعادة المحاولة
        </Button>
        <Button variant="outline" onClick={onClose} className="w-full text-white border-white">
          إغلاق
        </Button>
      </div>
    </div>
  );
};

export default ScannerErrorView;
