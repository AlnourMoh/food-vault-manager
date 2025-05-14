
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ScannerLoadingViewProps {
  onClose: () => void;
}

const ScannerLoadingView: React.FC<ScannerLoadingViewProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* زر إغلاق في الأعلى */}
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 text-white p-2" 
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
      
      {/* عنوان الماسح */}
      <div className="absolute top-4 w-full text-center">
        <h2 className="text-white text-xl font-medium">قارئ الباركود</h2>
      </div>
      
      {/* دائرة التحميل */}
      <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mb-6"></div>
      
      {/* نص التحميل */}
      <p className="text-white text-lg">جاري تهيئة الماسح الضوئي...</p>
    </div>
  );
};

export default ScannerLoadingView;
