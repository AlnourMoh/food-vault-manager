
import React from 'react';
import { Button } from '@/components/ui/button';
import ErrorDisplay from '@/components/mobile/network/ErrorDisplay';

interface NetworkErrorViewProps {
  onRetry: () => void;
  errorCode?: string;
  additionalInfo?: string;
  url?: string;
}

const NetworkErrorView: React.FC<NetworkErrorViewProps> = ({
  onRetry,
  errorCode,
  additionalInfo,
  url
}) => {
  return (
    <div className="min-h-screen flex flex-col p-6 bg-background">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <ErrorDisplay 
            errorCode={errorCode} 
            additionalInfo={additionalInfo}
            url={url}
          />
          
          <div className="mt-6">
            <Button 
              onClick={onRetry}
              className="w-full bg-primary"
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkErrorView;
