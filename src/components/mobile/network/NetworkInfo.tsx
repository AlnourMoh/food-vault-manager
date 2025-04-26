
import React from 'react';
import { Info, Server, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NetworkInfoProps {
  networkInfo: string;
  showDebugInfo: boolean;
  setShowDebugInfo: (show: boolean) => void;
}

const NetworkInfo = ({ networkInfo, showDebugInfo, setShowDebugInfo }: NetworkInfoProps) => {
  return (
    <div className="text-xs text-muted-foreground">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs" 
        onClick={() => setShowDebugInfo(!showDebugInfo)}
      >
        <Info className="w-3 h-3 ml-1" />
        {showDebugInfo ? 'إخفاء معلومات التشخيص' : 'عرض معلومات التشخيص'}
      </Button>
      
      {showDebugInfo && (
        <div className="mt-2 bg-muted p-3 rounded text-right text-xs">
          <div className="flex items-center mb-2">
            <Server className="w-3 h-3 ml-1" />
            <span className="font-medium">معلومات الخادم والاتصال:</span>
          </div>
          
          <pre className="whitespace-pre-wrap overflow-auto max-h-32">
            {networkInfo || "جاري جمع معلومات الاتصال..."}
          </pre>
          
          <div className="mt-2 pt-2 border-t border-muted-foreground/20">
            <div className="flex items-center mb-1">
              <Wifi className="w-3 h-3 ml-1" />
              <span className="font-medium">معلومات المتصفح:</span>
            </div>
            <p>المتصفح: {navigator.userAgent}</p>
            <p>نوع الجهاز: {/Mobi|Android/i.test(navigator.userAgent) ? 'هاتف محمول/جهاز لوحي' : 'كمبيوتر'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkInfo;
