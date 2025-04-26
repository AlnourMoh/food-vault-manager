
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import RetryControls from './network/RetryControls';
import CacheControls from './network/CacheControls';
import ErrorDisplay from './network/ErrorDisplay';
import NetworkInfo from './network/NetworkInfo';
import TroubleshootingSteps from './network/TroubleshootingSteps';

interface NetworkErrorViewProps {
  onRetry?: () => void;
  additionalInfo?: string;
}

const NetworkErrorView: React.FC<NetworkErrorViewProps> = ({ onRetry, additionalInfo }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [networkInfo, setNetworkInfo] = useState<string>('');
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);
  const [lastRetryTime, setLastRetryTime] = useState(0);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    if (autoRetryEnabled && retryCount < 5) {
      const now = Date.now();
      
      // Don't retry too frequently
      if (now - lastRetryTime < 5000 && lastRetryTime !== 0) {
        return;
      }
      
      // Exponential backoff: 5s, 10s, 20s, 30s, 30s max
      const backoffTime = Math.min(5000 * Math.pow(2, retryCount), 30000);
      console.log(`Scheduling auto retry attempt ${retryCount + 1} in ${backoffTime}ms`);
      
      const timer = setTimeout(() => {
        console.log(`Auto retry attempt ${retryCount + 1}`);
        handleRetry();
        setRetryCount(prev => prev + 1);
        setLastRetryTime(Date.now());
        setConnectionAttempts(prev => prev + 1);
      }, backoffTime);
      
      return () => clearTimeout(timer);
    }
  }, [retryCount, autoRetryEnabled, lastRetryTime, onRetry]);

  useEffect(() => {
    const checkNetworkStatus = () => {
      gatherNetworkInfo();
      
      const now = Date.now();
      if (navigator.onLine && autoRetryEnabled && onRetry && 
          connectionAttempts < 3 && (now - lastRetryTime > 15000 || lastRetryTime === 0)) {
        handleRetry();
        setLastRetryTime(now);
        setConnectionAttempts(prev => prev + 1);
      }
    };
    
    checkNetworkStatus();
    
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
    
    return () => {
      window.removeEventListener('online', checkNetworkStatus);
      window.removeEventListener('offline', checkNetworkStatus);
    };
  }, []);

  const gatherNetworkInfo = () => {
    const info = [];
    info.push(`متصل بالإنترنت: ${navigator.onLine ? 'نعم' : 'لا'}`);
    info.push(`وقت الفحص: ${new Date().toLocaleTimeString()}`);
    info.push(`عدد محاولات إعادة الاتصال: ${connectionAttempts}`);
    
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

  const handleRetry = () => {
    if (isChecking) {
      console.log('Already checking, ignoring retry request');
      return;
    }
    
    setIsChecking(true);
    setProgress(0);
    console.log('NetworkErrorView: Checking connection...');
    console.log('NetworkErrorView: Current online status:', navigator.onLine);
    
    toast({
      title: "جاري التحقق من الاتصال",
      description: "يرجى الانتظار بينما نتحقق من اتصالك بالشبكة",
    });
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Slow down the progress to match the delays we've added elsewhere
        return prev + 1.5;
      });
    }, 100);

    gatherNetworkInfo();
    
    if (onRetry) {
      // Introduce a slight delay before triggering retry
      setTimeout(() => {
        onRetry();
        // Keep checking state for a bit longer to avoid UI flicker
        setTimeout(() => {
          setIsChecking(false);
        }, 1500);
      }, 800);
    } else {
      setTimeout(() => {
        setIsChecking(false);
      }, 2500);
    }
  };

  const forceReload = () => {
    console.log('NetworkErrorView: Force reloading the application');
    toast({
      title: "جاري إعادة تحميل التطبيق",
      description: "يرجى الانتظار...",
    });
    setTimeout(() => window.location.reload(), 800);
  };

  const clearCacheAndReload = () => {
    console.log('NetworkErrorView: Clearing cache and reloading');
    toast({
      title: "جاري مسح ذاكرة التخزين المؤقت",
      description: "يرجى الانتظار...",
    });
    
    // Keep key authentication data
    const restaurantId = localStorage.getItem('restaurantId');
    const isRestaurantLogin = localStorage.getItem('isRestaurantLogin');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    
    localStorage.clear();
    
    // Restore key authentication data
    if (restaurantId) localStorage.setItem('restaurantId', restaurantId);
    if (isRestaurantLogin) localStorage.setItem('isRestaurantLogin', isRestaurantLogin);
    if (userEmail) localStorage.setItem('userEmail', userEmail);
    if (userName) localStorage.setItem('userName', userName);
    
    // Clear service worker registrations
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
    
    // Clear cache storage
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // A longer delay to ensure cache clearing completes
    setTimeout(() => {
      window.location.href = window.location.href.split('#')[0];
    }, 2500);
  };

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
          onForceReload={forceReload}
          onClearCache={clearCacheAndReload}
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
