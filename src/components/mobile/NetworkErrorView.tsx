
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCcw, SignalHigh, Info, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface NetworkErrorViewProps {
  onRetry?: () => void;
  additionalInfo?: string;
}

// Type declaration for Navigator with NetworkInformation
interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

const NetworkErrorView: React.FC<NetworkErrorViewProps> = ({ onRetry, additionalInfo }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [networkInfo, setNetworkInfo] = useState<string>('');
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Handle retry with progress
  const handleRetry = () => {
    setIsChecking(true);
    setProgress(0);
    
    // Log connectivity check
    console.log('NetworkErrorView: Checking connection...');
    console.log('NetworkErrorView: Current online status:', navigator.onLine);
    
    toast({
      title: "جاري التحقق من الاتصال",
      description: "يرجى الانتظار بينما نتحقق من اتصالك بالشبكة",
    });
    
    // Simulate checking connection with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsChecking(false);
          if (onRetry) {
            console.log('NetworkErrorView: Triggering onRetry callback');
            onRetry();
          }
          
          // Force reload the page if we're online
          if (navigator.onLine) {
            console.log('NetworkErrorView: Navigator reports online, reloading page');
            toast({
              title: "تم اكتشاف اتصال بالإنترنت",
              description: "جاري إعادة تحميل التطبيق",
            });
            setTimeout(() => window.location.reload(), 1500);
          }
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Gather network information
    gatherNetworkInfo();
    
    return () => clearInterval(interval);
  };

  // Gather detailed network information for debugging
  const gatherNetworkInfo = () => {
    const info = [];
    info.push(`متصل بالإنترنت: ${navigator.onLine ? 'نعم' : 'لا'}`);
    
    // Safely access connection information if available
    const nav = navigator as any;
    if (nav.connection) {
      const conn = nav.connection as NetworkInformation;
      if (conn.effectiveType) info.push(`نوع الاتصال: ${conn.effectiveType}`);
      if (conn.downlink) info.push(`سرعة التنزيل: ${conn.downlink} Mbps`);
      if (conn.rtt) info.push(`زمن الاستجابة: ${conn.rtt} ms`);
    }
    
    info.push(`وقت الفحص: ${new Date().toLocaleTimeString()}`);
    
    setNetworkInfo(info.join('\n'));
  };

  // Function to force reload the application
  const forceReload = () => {
    console.log('NetworkErrorView: Force reloading the application');
    toast({
      title: "جاري إعادة تحميل التطبيق",
      description: "يرجى الانتظار...",
    });
    setTimeout(() => window.location.reload(), 500);
  };
  
  // Function to clear browser cache and reload
  const clearCacheAndReload = () => {
    console.log('NetworkErrorView: Clearing cache and reloading');
    toast({
      title: "جاري مسح ذاكرة التخزين المؤقت",
      description: "يرجى الانتظار...",
    });
    
    // Clear local storage data related to auth
    localStorage.removeItem('isRestaurantLogin');
    localStorage.removeItem('restaurantId');
    
    // Use serviceWorker to clear cache if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
    
    // Force reload without cache
    setTimeout(() => {
      window.location.href = window.location.href.split('#')[0];
    }, 1000);
  };

  // Check if we're actually online
  useEffect(() => {
    if (navigator.onLine && !isChecking) {
      console.log('NetworkErrorView: Browser reports online but server connection failed');
      console.log('NetworkErrorView: Additional info:', additionalInfo);
    }
    
    // Log initial network state
    console.log('NetworkErrorView: Initial network state -', navigator.onLine ? 'Online' : 'Offline');
    
    // Setup online/offline event listeners for debugging
    const handleOnline = () => console.log('NetworkErrorView: Device went online');
    const handleOffline = () => console.log('NetworkErrorView: Device went offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isChecking, additionalInfo]);

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
            <Button 
              onClick={handleRetry}
              className="w-full"
              size="lg"
            >
              <RefreshCcw className="w-4 h-4 ml-2" />
              إعادة المحاولة
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={forceReload}
              >
                <ExternalLink className="w-4 h-4 ml-1" />
                إعادة تحميل التطبيق
              </Button>
              
              <Button
                variant="outline"
                onClick={clearCacheAndReload}
              >
                مسح الذاكرة المؤقتة
              </Button>
            </div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs" 
            onClick={() => setShowDebugInfo(!showDebugInfo)}
          >
            <Info className="w-3 h-3 ml-1" />
            معلومات للمطورين
          </Button>
          
          {showDebugInfo && (
            <div className="mt-2 bg-muted p-2 rounded text-right text-xs">
              <pre className="whitespace-pre-wrap">
                {networkInfo || "جاري جمع معلومات الاتصال..."}
              </pre>
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground mt-4">
          <p>إذا استمرت المشكلة:</p>
          <ul className="text-right mt-2 list-disc list-inside">
            <li>تحقق من وضع الطيران وتأكد من إيقاف تشغيله</li>
            <li>تحقق من اتصال WiFi أو بيانات الجوال</li>
            <li>قم بإعادة تشغيل جهاز التوجيه (الراوتر)</li>
            <li>تأكد من كتابة البريد الالكتروني وكلمة المرور بشكل صحيح (البريد بحروف صغيرة)</li>
            <li>أعد تشغيل التطبيق</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NetworkErrorView;
