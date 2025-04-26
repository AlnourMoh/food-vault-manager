import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseNetworkRetryProps {
  onRetry?: () => void;
}

export const useNetworkRetry = ({ onRetry }: UseNetworkRetryProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);

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
        return prev + 1.5;
      });
    }, 100);
    
    if (onRetry) {
      setTimeout(() => {
        onRetry();
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

  const handleForceReload = () => {
    console.log('NetworkErrorView: Force reloading the application');
    toast({
      title: "جاري إعادة تحميل التطبيق",
      description: "يرجى الانتظار...",
    });
    setTimeout(() => window.location.reload(), 800);
  };

  const handleClearCache = () => {
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

  return {
    isChecking,
    progress,
    autoRetryEnabled,
    setAutoRetryEnabled,
    handleRetry,
    handleForceReload,
    handleClearCache
  };
};
