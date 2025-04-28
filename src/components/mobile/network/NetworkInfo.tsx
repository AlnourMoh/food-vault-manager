
import React from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface NetworkInfoProps {
  networkInfo: {
    connectionType: string | null;
    effectiveType: string | null;
    downlink: number | null;
    rtt: number | null;
    online: boolean;
    lastUpdate: Date;
  };
  showDebugInfo: boolean;
  setShowDebugInfo: (value: boolean) => void;
}

const NetworkInfo: React.FC<NetworkInfoProps> = ({ 
  networkInfo, 
  showDebugInfo, 
  setShowDebugInfo 
}) => {
  const formatConnectionQuality = (effectiveType: string | null): string => {
    if (!effectiveType) return 'غير معروف';
    
    switch (effectiveType) {
      case 'slow-2g':
        return 'ضعيف جداً';
      case '2g':
        return 'ضعيف';
      case '3g':
        return 'متوسط';
      case '4g':
        return 'جيد';
      case '5g':
        return 'ممتاز';
      default:
        return effectiveType;
    }
  };

  return (
    <div className="mt-4">
      <button 
        onClick={() => setShowDebugInfo(!showDebugInfo)}
        className="flex items-center text-xs text-muted-foreground hover:text-primary"
      >
        <Info size={14} className="me-1" />
        <span>معلومات الاتصال</span>
        {showDebugInfo ? <ChevronUp size={14} className="ms-1" /> : <ChevronDown size={14} className="ms-1" />}
      </button>
      
      {showDebugInfo && (
        <div className="mt-2 bg-muted p-3 rounded-md text-xs text-muted-foreground">
          <div className="grid grid-cols-2 gap-2">
            <div>الحالة:</div>
            <div className={networkInfo.online ? "text-green-600" : "text-red-600"}>
              {networkInfo.online ? "متصل" : "غير متصل"}
            </div>
            
            <div>نوع الاتصال:</div>
            <div>{networkInfo.connectionType || "غير معروف"}</div>
            
            <div>جودة الاتصال:</div>
            <div>{formatConnectionQuality(networkInfo.effectiveType)}</div>
            
            {networkInfo.downlink !== null && (
              <>
                <div>سرعة التنزيل التقريبية:</div>
                <div>{networkInfo.downlink} Mbps</div>
              </>
            )}
            
            {networkInfo.rtt !== null && (
              <>
                <div>زمن الاستجابة (RTT):</div>
                <div>{networkInfo.rtt} ms</div>
              </>
            )}
            
            <div>آخر تحديث:</div>
            <div>{new Intl.DateTimeFormat('ar-EG', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }).format(networkInfo.lastUpdate)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkInfo;
