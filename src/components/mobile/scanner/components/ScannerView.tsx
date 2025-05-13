
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera } from 'lucide-react';

interface ScannerViewProps {
  onStartScan: () => void;
  onClose: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ 
  onStartScan,
  onClose
}) => {
  React.useEffect(() => {
    // عند تحميل المكون، نبدأ المسح تلقائياً
    const timer = setTimeout(() => {
      onStartScan();
    }, 200);
    
    return () => clearTimeout(timer);
  }, [onStartScan]);
  
  return (
    <div className="scanner-view">
      <div className="absolute top-4 left-4 z-20">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white text-black"
          onClick={onClose}
        >
          <ArrowLeft className="h-4 w-4 ml-1" />
          رجوع
        </Button>
      </div>
      
      <div className="scan-frame">
        <div className="scanner-line" />
        <div className="corner-top-left scanner-corner" />
        <div className="corner-top-right scanner-corner" />
        <div className="corner-bottom-left scanner-corner" />
        <div className="corner-bottom-right scanner-corner" />
      </div>
      
      <div className="scanner-status">
        جارٍ تنشيط الكاميرا...
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 text-center text-white text-sm">
        <p>وجّه الكاميرا إلى الباركود</p>
      </div>
    </div>
  );
};
