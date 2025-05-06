
import React, { useState } from 'react';
import { useNetworkRetry } from '@/hooks/network/useNetworkRetry';
import { useNetworkInfo } from '@/hooks/network/useNetworkInfo';
import { useDebugInfo } from '@/hooks/network/useDebugInfo';
import ErrorDisplay from './network/ErrorDisplay';
import RetryControls from './network/RetryControls';
import CacheControls from './network/CacheControls';
import NetworkInfo from './network/NetworkInfo';
import TroubleshootingSteps from './network/TroubleshootingSteps';
import NetworkDetails from './network/NetworkDetails';

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

        <NetworkDetails
          url={url}
          errorCode={errorCode}
          showDetails={showDetails}
          onToggleDetails={() => setShowDetails(!showDetails)}
        />
      </div>
    </div>
  );
};

export default NetworkErrorView;
