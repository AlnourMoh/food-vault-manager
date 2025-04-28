
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseNetworkRetryProps {
  onRetry?: () => void;
  maxRetries?: number;
}

export const useNetworkRetry = ({ onRetry, maxRetries = 3 }: UseNetworkRetryProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [lastRetryTime, setLastRetryTime] = useState(0);

  // Auto retry mechanism
  useEffect(() => {
    let retryTimer: number | undefined;
    
    if (autoRetryEnabled && !isChecking && navigator.onLine && retryCount < maxRetries) {
      // Calculate delay based on retry count (exponential backoff)
      const now = Date.now();
      const timeSinceLastRetry = now - lastRetryTime;
      const minRetryInterval = Math.min(30000, 5000 * Math.pow(1.5, retryCount)); // Max 30 seconds
      
      if (lastRetryTime === 0 || timeSinceLastRetry > minRetryInterval) {
        // Auto retry after calculated delay
        console.log(`[useNetworkRetry] Scheduling auto-retry #${retryCount + 1} in ${minRetryInterval}ms`);
        
        retryTimer = window.setTimeout(() => {
          console.log(`[useNetworkRetry] Auto retry attempt #${retryCount + 1}`);
          handleRetry();
        }, minRetryInterval);
      }
    }
    
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [autoRetryEnabled, isChecking, retryCount, lastRetryTime, maxRetries]);

  const handleRetry = () => {
    if (isChecking) {
      console.log('[useNetworkRetry] Already checking, ignoring retry request');
      return;
    }
    
    setIsChecking(true);
    setProgress(0);
    setRetryCount(prev => prev + 1);
    setLastRetryTime(Date.now());
    
    console.log('[useNetworkRetry] Checking connection...');
    console.log('[useNetworkRetry] Current online status:', navigator.onLine);
    
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
        return prev + 1.5;
      });
    }, 100);
    
    if (onRetry) {
      setTimeout(() => {
        onRetry();
        setTimeout(() => {
          setIsChecking(false);
        }, 1500);
        clearInterval(interval);
      }, 800);
    } else {
      setTimeout(() => {
        setIsChecking(false);
        clearInterval(interval);
        
        // Provide user feedback based on online status
        if (navigator.onLine) {
          toast({
            title: "تم التحقق من الاتصال",
            description: "أنت متصل بالإنترنت ولكن قد لا يزال هناك مشكلة في الاتصال بالخادم"
          });
        } else {
          toast({
            variant: "destructive",
            title: "فشل الاتصال",
            description: "تأكد من اتصالك بالإنترنت أو بشبكة WiFi"
          });
        }
      }, 2500);
    }
  };

  const handleForceReload = () => {
    console.log('[useNetworkRetry] Force reloading the application');
    toast({
      title: "جاري إعادة تحميل التطبيق",
      description: "يرجى الانتظار...",
    });
    setTimeout(() => window.location.reload(), 800);
  };

  const handleClearCache = () => {
    console.log('[useNetworkRetry] Clearing cache and reloading');
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

  return {
    isChecking,
    progress,
    autoRetryEnabled,
    setAutoRetryEnabled,
    retryCount,
    handleRetry,
    handleForceReload,
    handleClearCache
  };
};
