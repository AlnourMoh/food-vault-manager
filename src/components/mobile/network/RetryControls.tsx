
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface RetryControlsProps {
  isChecking: boolean;
  progress: number;
  onRetry: () => void;
  autoRetryEnabled: boolean;
  setAutoRetryEnabled: (enabled: boolean) => void;
  retryCount: number;
}

const RetryControls: React.FC<RetryControlsProps> = ({
  isChecking,
  progress,
  onRetry,
  autoRetryEnabled,
  setAutoRetryEnabled,
  retryCount
}) => {
  return (
    <div className="space-y-3">
      <button
        className={`w-full py-3 rounded-md flex items-center justify-center font-medium ${
          isChecking
            ? 'bg-primary/70 text-primary-foreground'
            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
        }`}
        onClick={onRetry}
        disabled={isChecking}
      >
        {isChecking ? (
          <>
            <span className="animate-spin mr-2">
              <RefreshCw size={16} />
            </span>
            جاري التحقق... {progress}%
          </>
        ) : (
          <>
            <RefreshCw size={16} className="mr-2" />
            إعادة المحاولة
          </>
        )}
      </button>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {retryCount > 0 && `محاولات الاتصال: ${retryCount}`}
        </span>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="auto-retry"
            checked={autoRetryEnabled}
            onChange={(e) => setAutoRetryEnabled(e.target.checked)}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="auto-retry" className="text-sm cursor-pointer select-none">
            المحاولة تلقائيًا
          </label>
        </div>
      </div>
    </div>
  );
};

export default RetryControls;
