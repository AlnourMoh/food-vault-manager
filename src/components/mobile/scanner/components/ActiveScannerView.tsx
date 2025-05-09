
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ActiveScannerViewProps {
  cameraActive: boolean;
  onClose: () => void;
}

export const ActiveScannerView: React.FC<ActiveScannerViewProps> = ({ cameraActive, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
      <div 
        className="barcode-scanner-view"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
        }}
      >
        {cameraActive ? (
          <>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-72 h-72 border-4 border-white/80 rounded-lg opacity-80 shadow-inner"></div>
            </div>
            <p className="absolute bottom-32 left-0 right-0 text-center text-white text-lg font-medium">
              وجه الكاميرا نحو الرمز الشريطي
            </p>
          </>
        ) : (
          <div className="text-white text-center">
            <p>جاري تشغيل الكاميرا...</p>
          </div>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        onClick={onClose}
        className="absolute top-4 right-4 bg-black/20 text-white rounded-full p-2 w-10 h-10"
        size="icon"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
