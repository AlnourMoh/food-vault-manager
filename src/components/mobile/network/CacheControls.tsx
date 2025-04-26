
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CacheControlsProps {
  onForceReload: () => void;
  onClearCache: () => void;
}

const CacheControls = ({ onForceReload, onClearCache }: CacheControlsProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" onClick={onForceReload}>
        <ExternalLink className="w-4 h-4 ml-1" />
        إعادة تحميل التطبيق
      </Button>
      
      <Button variant="outline" onClick={onClearCache}>
        مسح الذاكرة المؤقتة
      </Button>
    </div>
  );
};

export default CacheControls;
