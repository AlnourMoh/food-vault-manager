
import React from 'react';
import { Info } from 'lucide-react';
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
  );
};

export default NetworkInfo;
