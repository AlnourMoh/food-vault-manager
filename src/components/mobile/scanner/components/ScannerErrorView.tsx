
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';

interface ScannerErrorViewProps {
  errorMessage: string | null;
  onRetry: () => void;
  onClose: () => void;
}

export const ScannerErrorView: React.FC<ScannerErrorViewProps> = ({ errorMessage, onRetry, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="bg-background rounded-lg p-6 w-full max-w-md text-center">
        <div className="mx-auto bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <RefreshCw className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">حدث خطأ</h2>
        <p className="text-muted-foreground mb-6">{errorMessage || "حدث خطأ أثناء تشغيل الماسح الضوئي"}</p>
        <div className="space-y-2">
          <Button onClick={onRetry} className="w-full">
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            <X className="h-4 w-4 ml-2" />
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
};
