
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useNetworkRetry } from '@/hooks/network/useNetworkRetry';
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
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<string>('');
  
  const { 
    isChecking,
    progress,
    autoRetryEnabled,
    setAutoRetryEnabled,
    handleRetry,
    handleForceReload,
    handleClearCache
  } = useNetworkRetry({ onRetry });

  useEffect(() => {
    const gatherNetworkInfo = () => {
      const info = [];
      info.push(`متصل بالإنترنت: ${navigator.onLine ? 'نعم' : 'لا'}`);
      info.push(`وقت الفحص: ${new Date().toLocaleTimeString()}`);
      
      if ('connection' in navigator && navigator.connection) {
        const conn = navigator.connection as any;
        if (conn.effectiveType) {
          info.push(`نوع الاتصال: ${conn.effectiveType}`);
        }
        if (conn.downlink) {
          info.push(`سرعة التحميل: ${conn.downlink} Mbps`);
        }
        if (conn.rtt) {
          info.push(`وقت الاستجابة: ${conn.rtt} ms`);
        }
      }
      
      setNetworkInfo(info.join('\n'));
    };
    
    gatherNetworkInfo();
    
    window.addEventListener('online', gatherNetworkInfo);
    window.addEventListener('offline', gatherNetworkInfo);
    
    return () => {
      window.removeEventListener('online', gatherNetworkInfo);
      window.removeEventListener('offline', gatherNetworkInfo);
    };
  }, []);

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
