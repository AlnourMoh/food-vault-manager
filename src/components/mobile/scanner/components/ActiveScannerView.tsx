
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera, RefreshCw } from 'lucide-react';

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

  const [scanAnimationActive, setScanAnimationActive] = useState(true);

  // تنشيط خط المسح المتحرك عندما تكون الكاميرا نشطة
  useEffect(() => {
    if (cameraActive) {
      setScanAnimationActive(true);
    }
  }, [cameraActive]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center">
      {/* رسالة تحميل أو انتظار تفعيل الكاميرا */}
      {!cameraActive && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center flex-col z-20">
          <RefreshCw className="animate-spin h-16 w-16 text-white mb-4" />
          <p className="text-white text-lg font-bold">جاري تفعيل الكاميرا...</p>
          <p className="text-gray-300 mt-2 text-sm text-center px-6">
            إذا استمر هذا لفترة طويلة، تأكد من منح الإذن للكاميرا في إعدادات جهازك
          </p>
        </div>
      )}
      
      {/* الكاميرا النشطة أو المنطقة السوداء التي ستحتوي الكاميرا */}
      <div className="relative flex-1 w-full bg-transparent">
        {/* رسالة توجيه للمستخدم */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center w-full z-10">
          <h3 className="font-bold text-lg mb-1">قم بتوجيه الكاميرا نحو الباركود</h3>
          <p className="text-sm opacity-75">سيتم التعرف عليه تلقائياً</p>
        </div>

        {/* إطار المسح */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 aspect-video border-2 border-white rounded-lg overflow-hidden z-10">
          {/* خط المسح المتحرك */}
          <div className={`absolute left-0 w-full h-0.5 bg-red-500 ${scanAnimationActive ? 'animate-scanner-line' : ''}`} />
          
          {/* زوايا الإطار */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white"></div>
        </div>
        
        {/* رسالة الحالة */}
        {isScanningActive && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm z-10">
            جاري المسح...
          </div>
        )}
      </div>
      
      {/* شريط أدوات الماسح */}
      <div className="bg-black w-full p-4 flex justify-between items-center z-10">
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
            className={`${cameraActive ? 'bg-white' : 'bg-gray-400'} text-black rounded-full w-16 h-16 flex items-center justify-center`}
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
