
import React, { useState } from 'react';
import { RotateCcw, RefreshCw } from 'lucide-react';

interface CacheControlsProps {
  onForceReload: () => void;
  onClearCache: () => void;
}

const CacheControls: React.FC<CacheControlsProps> = ({
  onForceReload,
  onClearCache
}) => {
  const [isClearing, setIsClearing] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  
  const handleClearCache = async () => {
    setIsClearing(true);
    await onClearCache();
    setTimeout(() => setIsClearing(false), 2000);
  };
  
  const handleForceReload = () => {
    setIsReloading(true);
    onForceReload();
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        className="py-2 px-3 bg-muted hover:bg-muted/80 rounded-md flex items-center justify-center text-sm"
        onClick={handleForceReload}
        disabled={isReloading}
      >
        {isReloading ? (
          <span className="animate-spin mr-1">
            <RefreshCw size={14} />
          </span>
        ) : (
          <RefreshCw size={14} className="mr-1" />
        )}
        إعادة التحميل
      </button>
      
      <button
        className="py-2 px-3 bg-muted hover:bg-muted/80 rounded-md flex items-center justify-center text-sm"
        onClick={handleClearCache}
        disabled={isClearing}
      >
        {isClearing ? (
          <span className="animate-spin mr-1">
            <RotateCcw size={14} />
          </span>
        ) : (
          <RotateCcw size={14} className="mr-1" />
        )}
        مسح الذاكرة المؤقتة
      </button>
    </div>
  );
};

export default CacheControls;
