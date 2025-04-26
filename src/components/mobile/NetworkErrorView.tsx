
import React from 'react';
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
}

const NetworkErrorView: React.FC<NetworkErrorViewProps> = ({ onRetry, additionalInfo }) => {
  const { 
    isChecking,
    progress,
    autoRetryEnabled,
    setAutoRetryEnabled,
    handleRetry,
    handleForceReload,
    handleClearCache
  } = useNetworkRetry({ onRetry });
  
  const networkInfo = useNetworkInfo();
  const { showDebugInfo, setShowDebugInfo } = useDebugInfo();

  return (
    <div className="rtl min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md animate-fadeIn">
        <ErrorDisplay additionalInfo={additionalInfo} />
        
        <RetryControls
          isChecking={isChecking}
          progress={progress}
          onRetry={handleRetry}
          autoRetryEnabled={autoRetryEnabled}
          setAutoRetryEnabled={setAutoRetryEnabled}
        />
        
        <CacheControls
          onForceReload={handleForceReload}
          onClearCache={handleClearCache}
        />
        
        <NetworkInfo 
          networkInfo={networkInfo}
          showDebugInfo={showDebugInfo}
          setShowDebugInfo={setShowDebugInfo}
        />
        
        <TroubleshootingSteps />
      </div>
    </div>
  );
};

export default NetworkErrorView;
