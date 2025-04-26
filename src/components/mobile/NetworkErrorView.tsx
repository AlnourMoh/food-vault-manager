import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCcw, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
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

  useEffect(() => {
    if (retryCount < 3) {
      const timer = setTimeout(() => {
        console.log(`Auto retry attempt ${retryCount + 1}`);
        handleRetry();
        setRetryCount(prev => prev + 1);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [retryCount]);

  const gatherNetworkInfo = () => {
    const info = [];
    info.push(`متصل بالإنترنت: ${navigator.onLine ? 'نعم' : 'لا'}`);
    info.push(`وقت الفحص: ${new Date().toLocaleTimeString()}`);
    info.push(`عدد محاولات إعادة الاتصال: ${retryCount}`);
    
    if ('connection' in navigator && navigator.connection) {
      const conn = navigator.connection as any;
      if (conn.effectiveType) {
        info.push(`نوع الاتصال: ${conn.effectiveType}`);
      }
    }
    
    setNetworkInfo(info.join('\n'));
  };

  const handleRetry = () => {
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
          setIsChecking(false);
          return 100;
        }
        return prev + 4;
      });
    }, 200);

    gatherNetworkInfo();
    
    if (onRetry) {
      setTimeout(() => {
        onRetry();
      }, 1000);
    }
  };

  const forceReload = () => {
    console.log('NetworkErrorView: Force reloading the application');
    toast({
      title: "جاري إعادة تحميل التطبيق",
      description: "يرجى الانتظار...",
    });
    setTimeout(() => window.location.reload(), 500);
  };

  const clearCacheAndReload = () => {
    console.log('NetworkErrorView: Clearing cache and reloading');
    toast({
      title: "جاري مسح ذاكرة التخزين المؤقت",
      description: "يرجى الانتظار...",
    });
    
    const restaurantId = localStorage.getItem('restaurantId');
    const isRestaurantLogin = localStorage.getItem('isRestaurantLogin');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    
    localStorage.clear();
    
    if (restaurantId) localStorage.setItem('restaurantId', restaurantId);
    if (isRestaurantLogin) localStorage.setItem('isRestaurantLogin', isRestaurantLogin);
    if (userEmail) localStorage.setItem('userEmail', userEmail);
    if (userName) localStorage.setItem('userName', userName);
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
    
    setTimeout(() => {
      window.location.href = window.location.href.split('#')[0];
    }, 1000);
  };

  return (
    <div className="rtl min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="bg-muted rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
          <WifiOff className="w-12 h-12 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">عذراً، حدث خطأ في الاتصال</h1>
          <p className="text-muted-foreground">
            يبدو أن هناك مشكلة في الاتصال بالإنترنت أو السيرفر. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
          </p>
          {additionalInfo && (
            <div className="bg-red-50 text-red-700 p-2 rounded-md text-sm mt-2">
              {additionalInfo}
            </div>
          )}
        </div>

        {isChecking ? (
          <div className="w-full space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">جارٍ التحقق من الاتصال...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Button onClick={handleRetry} className="w-full" size="lg">
              <RefreshCcw className="w-4 h-4 ml-2" />
              إعادة المحاولة
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={forceReload}>
                <ExternalLink className="w-4 h-4 ml-1" />
                إعادة تحميل التطبيق
              </Button>
              
              <Button variant="outline" onClick={clearCacheAndReload}>
                مسح الذاكرة المؤقتة
              </Button>
            </div>
          </div>
        )}
        
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
