
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScanBarcode } from 'lucide-react';

interface ScannerErrorViewProps {
  onRetry: () => void;
}

export const ScannerErrorView = ({ onRetry }: ScannerErrorViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-background rounded-lg">
      <div className="p-3 bg-red-100 text-red-600 rounded-full">
        <ScanBarcode className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold">حدث خطأ في الماسح الضوئي</h3>
      <p className="text-center text-muted-foreground">
        لم نتمكن من الوصول إلى الكاميرا أو حدث خطأ أثناء محاولة مسح الباركود
      </p>
      <Button onClick={onRetry} className="mt-4">
        إعادة المحاولة
      </Button>
    </div>
  );
};
