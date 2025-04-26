
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCcw, SignalHigh } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface NetworkErrorViewProps {
  onRetry?: () => void;
}

const NetworkErrorView: React.FC<NetworkErrorViewProps> = ({ onRetry }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle retry with progress
  const handleRetry = () => {
    setIsChecking(true);
    setProgress(0);
    
    // Simulate checking connection with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsChecking(false);
          if (onRetry) onRetry();
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  };

  // Check if we're actually online
  useEffect(() => {
    if (navigator.onLine && !isChecking) {
      // If browser thinks we're online but we're seeing this screen,
      // it might be a server connection issue
      console.log('Browser reports online but server connection failed');
    }
  }, [isChecking]);

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
        </div>

        {isChecking ? (
          <div className="w-full space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">جارٍ التحقق من الاتصال...</p>
          </div>
        ) : (
          <Button 
            onClick={handleRetry}
            className="w-full"
            size="lg"
          >
            <RefreshCcw className="w-4 h-4 ml-2" />
            إعادة المحاولة
          </Button>
        )}
        
        <div className="text-xs text-muted-foreground mt-4">
          <p>إذا استمرت المشكلة:</p>
          <ul className="text-right mt-2 list-disc list-inside">
            <li>تحقق من وضع الطيران وتأكد من إيقاف تشغيله</li>
            <li>تحقق من اتصال WiFi أو بيانات الجوال</li>
            <li>قم بإعادة تشغيل جهاز التوجيه (الراوتر)</li>
            <li>أعد تشغيل التطبيق</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NetworkErrorView;
