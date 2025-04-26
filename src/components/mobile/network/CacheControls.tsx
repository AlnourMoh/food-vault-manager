
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';

interface CacheControlsProps {
  onForceReload: () => void;
  onClearCache: () => void;
}

const CacheControls = ({ onForceReload, onClearCache }: CacheControlsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button variant="outline" onClick={onForceReload} className="flex items-center justify-center py-5">
        <RefreshCw className="w-4 h-4 ml-1" />
        <div className="flex flex-col items-start">
          <span>إعادة تحميل</span>
          <span className="text-[10px] opacity-70">تحديث الصفحة</span>
        </div>
      </Button>
      
      <Button variant="outline" onClick={onClearCache} className="flex items-center justify-center py-5">
        <Trash2 className="w-4 h-4 ml-1" />
        <div className="flex flex-col items-start">
          <span>مسح الذاكرة</span>
          <span className="text-[10px] opacity-70">حل مشاكل التطبيق</span>
        </div>
      </Button>
    </div>
  );
};

export default CacheControls;
