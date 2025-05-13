
import React from 'react';
import { Button } from '@/components/ui/button';

interface ScannerErrorBannerProps {
  message: string;
  subMessage?: string;
  onRetry?: () => void;
}

export const ScannerErrorBanner: React.FC<ScannerErrorBannerProps> = ({ 
  message, 
  subMessage,
  onRetry 
}) => {
  return (
    <div className="w-full rounded-md bg-red-500 text-white p-4 mb-4 text-center">
      <div className="text-xl font-semibold mb-2">{message}</div>
      {subMessage && <div className="text-white mb-4">{subMessage}</div>}
    </div>
  );
};

export const ScannerErrorCard: React.FC<ScannerErrorBannerProps> = ({ 
  message, 
  subMessage,
  onRetry 
}) => {
  return (
    <div className="w-full rounded-md bg-red-50 border border-red-200 p-6 mb-4 text-center">
      <div className="text-xl font-semibold text-red-700 mb-3">حدث خطأ أثناء المسح</div>
      <div className="text-red-700 mb-4">{message}</div>
      {subMessage && <div className="text-red-600 mb-4">{subMessage}</div>}
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-red-100 hover:bg-red-200 text-red-800 border border-red-300"
        >
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};
