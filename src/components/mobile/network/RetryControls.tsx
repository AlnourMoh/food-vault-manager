
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface RetryControlsProps {
  isChecking: boolean;
  progress: number;
  onRetry: () => void;
  autoRetryEnabled: boolean;
  setAutoRetryEnabled: (enabled: boolean) => void;
}

const RetryControls = ({
  isChecking,
  progress,
  onRetry,
  autoRetryEnabled,
  setAutoRetryEnabled
}: RetryControlsProps) => {
  if (isChecking) {
    return (
      <div className="w-full space-y-2">
        <Progress value={progress} className="w-full h-2 bg-gray-200" />
        <p className="text-sm text-muted-foreground animate-pulse">جارٍ التحقق من الاتصال...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button 
        onClick={onRetry} 
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        size="lg"
      >
        <RefreshCcw className="w-4 h-4 ml-2 animate-spin-slow" />
        إعادة المحاولة الآن
      </Button>
      
      <div className="flex items-center justify-center mt-2">
        <input 
          type="checkbox" 
          id="auto-retry" 
          className="mr-2"
          checked={autoRetryEnabled}
          onChange={() => setAutoRetryEnabled(!autoRetryEnabled)}
        />
        <label htmlFor="auto-retry" className="text-sm text-muted-foreground">
          محاولة إعادة الاتصال تلقائياً
        </label>
      </div>
    </div>
  );
};

export default RetryControls;
