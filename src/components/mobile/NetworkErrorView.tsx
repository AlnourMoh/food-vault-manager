
import React from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCcw } from 'lucide-react';

interface NetworkErrorViewProps {
  onRetry?: () => void;
}

const NetworkErrorView: React.FC<NetworkErrorViewProps> = ({ onRetry }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="bg-muted rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
          <WifiOff className="w-12 h-12 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">عذراً، حدث خطأ في الاتصال</h1>
          <p className="text-muted-foreground">
            يبدو أن هناك مشكلة في الاتصال بالإنترنت أو السيرفر. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
          </p>
        </div>

        <Button 
          onClick={onRetry}
          className="w-full"
          size="lg"
        >
          <RefreshCcw className="w-4 h-4 ml-2" />
          إعادة المحاولة
        </Button>
      </div>
    </div>
  );
};

export default NetworkErrorView;
