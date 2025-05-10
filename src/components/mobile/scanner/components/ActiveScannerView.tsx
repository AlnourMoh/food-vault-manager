
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera } from 'lucide-react';

interface ActiveScannerViewProps {
  cameraActive: boolean;
  isScanningActive: boolean;
  onClose: () => void;
}

export const ActiveScannerView: React.FC<ActiveScannerViewProps> = ({ 
  cameraActive,
  isScanningActive,
  onClose 
}) => {
  // تسجيل لحالة الكاميرا النشطة
  useEffect(() => {
    console.log("ActiveScannerView: حالة الكاميرا:", { cameraActive, isScanningActive });
  }, [cameraActive, isScanningActive]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center">
      {/* الكاميرا النشطة أو المنطقة السوداء التي ستحتوي الكاميرا */}
      <div className="relative flex-1 w-full bg-transparent">
        {/* رسالة توجيه للمستخدم */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center w-full">
          <h3 className="font-bold text-lg mb-1">قم بتوجيه الكاميرا نحو الباركود</h3>
          <p className="text-sm opacity-75">سيتم التعرف عليه تلقائياً</p>
        </div>

        {/* إطار المسح */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 aspect-video border-2 border-white rounded-lg overflow-hidden">
          {/* خط المسح المتحرك */}
          <div className="absolute left-0 w-full h-0.5 bg-red-500 animate-scanner-line"></div>
          
          {/* زوايا الإطار */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white"></div>
        </div>
        
        {/* رسالة الحالة */}
        {isScanningActive && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
            جاري المسح...
          </div>
        )}
      </div>
      
      {/* شريط أدوات الماسح */}
      <div className="bg-black w-full p-4 flex justify-between items-center">
        <Button
          onClick={onClose}
          variant="ghost"
          className="text-white hover:text-gray-300"
        >
          إغلاق
        </Button>
        
        <div className="flex-1 flex justify-center">
          <Button
            variant="ghost"
            size="lg"
            className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center"
            disabled={!cameraActive}
          >
            <Camera className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="w-16"></div> {/* Spacer for balance */}
      </div>
    </div>
  );
};
