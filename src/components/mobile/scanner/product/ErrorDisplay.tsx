
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex flex-col items-center">
      <p className="font-semibold mb-1">حدث خطأ أثناء المسح:</p>
      <p>{error}</p>
      <Button 
        onClick={onRetry}
        className="mt-2 bg-red-100 hover:bg-red-200 text-red-800"
        size="sm"
      >
        إعادة المحاولة
      </Button>
    </div>
  );
};
