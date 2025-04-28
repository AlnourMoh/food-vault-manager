
import React, { useState } from 'react';
import { useNetworkRetry } from '@/hooks/network/useNetworkRetry';
import { useNetworkInfo } from '@/hooks/network/useNetworkInfo';
import { useDebugInfo } from '@/hooks/network/useDebugInfo';
import ErrorDisplay from './network/ErrorDisplay';
import RetryControls from './network/RetryControls';
import CacheControls from './network/CacheControls';
import NetworkInfo from './network/NetworkInfo';
import TroubleshootingSteps from './network/TroubleshootingSteps';

interface NetworkErrorViewProps {
  onRetry?: () => void;
  additionalInfo?: string;
  errorCode?: string;
  url?: string;
}

const NetworkErrorView: React.FC<NetworkErrorViewProps> = ({ 
  onRetry, 
  additionalInfo, 
  errorCode,
  url
}) => {
  const { 
    isChecking,
    progress,
    autoRetryEnabled,
    setAutoRetryEnabled,
    retryCount,
    handleRetry,
    handleForceReload,
    handleClearCache
  } = useNetworkRetry({ onRetry });
  
  const [showDetails, setShowDetails] = useState(false);
  const networkInfo = useNetworkInfo();
  const { showDebugInfo, setShowDebugInfo } = useDebugInfo();

  return (
    <div className="rtl min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md animate-fadeIn">
        <ErrorDisplay 
          additionalInfo={additionalInfo} 
          errorCode={errorCode} 
          url={url}
        />
        
        <RetryControls
          isChecking={isChecking}
          progress={progress}
          onRetry={handleRetry}
          autoRetryEnabled={autoRetryEnabled}
          setAutoRetryEnabled={setAutoRetryEnabled}
          retryCount={retryCount}
        />
        
        <CacheControls
          onForceReload={handleForceReload}
          onClearCache={handleClearCache}
        />
        
        <TroubleshootingSteps />
        
        <NetworkInfo 
          networkInfo={networkInfo}
          showDebugInfo={showDebugInfo}
          setShowDebugInfo={setShowDebugInfo}
        />

        <div className="mt-8 text-xs text-muted-foreground">
          <button 
            className="text-primary hover:underline" 
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'إخفاء التفاصيل التقنية' : 'عرض التفاصيل التقنية'}
          </button>
          
          {showDetails && (
            <div className="mt-2 bg-muted p-2 rounded text-left font-mono text-xs overflow-x-auto">
              <p>User Agent: {navigator.userAgent}</p>
              <p>App Version: FoodVaultManager/1.0.0</p>
              <p>URL: {url || window.location.href}</p>
              <p>Error Code: {errorCode || 'Unknown'}</p>
              <p>Connection Type: {networkInfo.connectionType || 'Unknown'}</p>
              <p>Retry Count: {retryCount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkErrorView;
