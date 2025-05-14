
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ScannerActiveViewProps {
  isActive: boolean;
  onStartScan: () => Promise<void>;
  onClose: () => void;
}

const ScannerActiveView: React.FC<ScannerActiveViewProps> = ({ 
  isActive, 
  onStartScan, 
  onClose 
}) => {
  // تشغيل المسح تلقائيًا عند التحميل
  useEffect(() => {
    if (!isActive) {
      onStartScan();
    }
  }, [isActive, onStartScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* زر الإغلاق */}
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 text-white p-2 z-50" 
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
      
      {/* عنوان الماسح */}
      <div className="absolute top-4 w-full text-center z-50">
        <h2 className="text-white text-xl font-medium">قارئ الباركود</h2>
      </div>
      
      {/* منطقة مسح الباركود */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* إطار المسح */}
        <div className="w-64 h-64 border-2 border-white/50 rounded-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* خط المسح المتحرك */}
            <div className="w-full h-1 bg-red-500 absolute animate-[scanner_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
      
      {/* منطقة التعليمات */}
      <div className="pb-8 text-center">
        <p className="text-white">وجه الكاميرا نحو الباركود للمسح</p>
      </div>
    </div>
  );
};

export default ScannerActiveView;
